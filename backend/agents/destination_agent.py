# agents/destination_agent.py

import os
from dotenv import load_dotenv
from models.flan_wrapper import ask_model
from utils.prompts import make_prompt
import requests

load_dotenv()
OPENTRIPMAP_API_KEY = os.environ.get("OPENTRIPMAP_API_KEY")

FALLBACK_DESTINATIONS = ["Japan", "Peru", "Canada", "Nepal", "Morocco", "Australia"]

DESTINATION_DB = {
    "mountains": ["Nepal", "Peru", "Switzerland", "Bhutan", "Canada"],
    "beaches": ["Maldives", "Bali", "Hawaii", "Ibiza", "Phuket"],
    "culture": ["Japan", "Italy", "Morocco", "India", "Turkey"],
    # ... more categories
}

def get_destinations_from_opentripmap(interest, limit=3):
    url = (
        f"https://api.opentripmap.com/0.1/en/places/autosuggest"
        f"?apikey={OPENTRIPMAP_API_KEY}&name={interest}&limit={limit}"
    )
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        # Extract names of places
        destinations = [item['name'] for item in data.get('features', []) if item.get('name')]
        return ", ".join(destinations) if destinations else ""
    else:
        return ""

def post_process_destinations(output):
    # Split by comma or whitespace, strip, and remove duplicates
    destinations = [d.strip() for d in output.replace("\n", ",").split(",") if d.strip()]
    unique_destinations = []
    for d in destinations:
        if d.lower() not in [u.lower() for u in unique_destinations]:
            unique_destinations.append(d)
        if len(unique_destinations) == 3:
            break
    # Fill with fallback if not enough unique
    for fallback in FALLBACK_DESTINATIONS:
        if len(unique_destinations) == 3:
            break
        if fallback.lower() not in [u.lower() for u in unique_destinations]:
            unique_destinations.append(fallback)
    return ", ".join(unique_destinations)

def get_destinations_from_db(interest):
    interest_lower = interest.lower()
    # Build a mapping of possible forms for each category
    category_forms = {}
    for cat in DESTINATION_DB:
        forms = [cat]
        # Add singular/plural forms
        if cat.endswith('s'):
            forms.append(cat[:-1])  # e.g., "mountains" -> "mountain"
        else:
            forms.append(cat + 's')  # e.g., "beach" -> "beaches"
        category_forms[cat] = forms

    # Find all categories and their positions in the interest string
    found = []
    for cat, forms in category_forms.items():
        positions = [interest_lower.find(form) for form in forms if form in interest_lower]
        if positions:
            found.append((cat, min(positions)))
    # Sort by position in the string
    found = sorted(found, key=lambda x: x[1] if x[1] != -1 else float('inf'))
    if not found:
        return ""
    lists = [DESTINATION_DB[cat] for cat, _ in found]
    interleaved = []
    for i in range(max(len(lst) for lst in lists)):
        for lst in lists:
            if i < len(lst) and lst[i] not in interleaved:
                interleaved.append(lst[i])
            if len(interleaved) == 3:
                break
        if len(interleaved) == 3:
            break
    if len(interleaved) < 3:
        interleaved += ["France", "Australia", "Brazil"][:3-len(interleaved)]
    return ", ".join(interleaved)

def get_destinations(user_input: dict) -> dict:
    interest = user_input.get("interest", "culture and food")
    # Try OpenTripMap API first
    api_result = get_destinations_from_opentripmap(interest)
    if api_result:
        return {"destinations": api_result}
    # Fallback to DB/LLM
    db_result = get_destinations_from_db(interest)
    if db_result and db_result.count(',') >= 2:
        return {"destinations": db_result}
    prompt = make_prompt(interest)
    response = ask_model(prompt)
    destinations = post_process_destinations(response)
    return {"destinations": destinations}
