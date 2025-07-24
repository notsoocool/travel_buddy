import os
from dotenv import load_dotenv
from models.flan_wrapper import ask_model
from utils.prompts import make_prompt
import requests
import traceback

load_dotenv()
OPENTRIPMAP_API_KEY = os.environ.get("OPENTRIPMAP_API_KEY")

FALLBACK_DESTINATIONS = ["Japan", "Peru", "Canada", "Nepal", "Morocco", "Australia"]
DESTINATION_DB = {
    "mountains": ["Nepal", "Peru", "Switzerland", "Bhutan", "Canada"],
    "beaches": ["Maldives", "Bali", "Hawaii", "Ibiza", "Phuket"],
    "culture": ["Japan", "Italy", "Morocco", "India", "Turkey"],
    "adventure": ["New Zealand", "Costa Rica", "Iceland", "Norway", "Chile"],
    "food": ["Italy", "Japan", "Thailand", "France", "Mexico"],
    "history": ["Egypt", "Greece", "Italy", "China", "India"],
    "nature": ["Costa Rica", "Kenya", "Brazil", "Australia", "Canada"],
    "shopping": ["Dubai", "Singapore", "Hong Kong", "New York", "Paris"],
    "nightlife": ["Ibiza", "Las Vegas", "Bangkok", "Berlin", "Miami"],
    "relaxation": ["Maldives", "Bali", "Seychelles", "Fiji", "Mauritius"]
}

def get_destinations_from_opentripmap(interest, limit=5):
    if not OPENTRIPMAP_API_KEY:
        return ""
    url = (
        f"https://api.opentripmap.com/0.1/en/places/autosuggest"
        f"?apikey={OPENTRIPMAP_API_KEY}&name={interest}&limit={limit}"
    )
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            destinations = [item['name'] for item in data.get('features', []) if item.get('name')]
            return ", ".join(destinations) if destinations else ""
    except Exception as e:
        print(f"OpenTripMap error: {e}")
    return ""

def post_process_destinations(output):
    destinations = [d.strip() for d in output.replace("\n", ",").split(",") if d.strip()]
    unique_destinations = []
    for d in destinations:
        if d.lower() not in [u.lower() for u in unique_destinations]:
            unique_destinations.append(d)
        if len(unique_destinations) == 5:
            break
    for fallback in FALLBACK_DESTINATIONS:
        if len(unique_destinations) == 5:
            break
        if fallback.lower() not in [u.lower() for u in unique_destinations]:
            unique_destinations.append(fallback)
    return ", ".join(unique_destinations)

def get_destinations_from_db(interest):
    interest_lower = interest.lower()
    category_forms = {}
    for cat in DESTINATION_DB:
        forms = [cat]
        if cat.endswith('s'):
            forms.append(cat[:-1])
        else:
            forms.append(cat + 's')
        category_forms[cat] = forms
    found = []
    for cat, forms in category_forms.items():
        positions = [interest_lower.find(form) for form in forms if form in interest_lower]
        if positions:
            found.append((cat, min(positions)))
    found = sorted(found, key=lambda x: x[1] if x[1] != -1 else float('inf'))
    if not found:
        return ""
    lists = [DESTINATION_DB[cat] for cat, _ in found]
    interleaved = []
    for i in range(max(len(lst) for lst in lists)):
        for lst in lists:
            if i < len(lst) and lst[i] not in interleaved:
                interleaved.append(lst[i])
            if len(interleaved) == 5:
                break
        if len(interleaved) == 5:
            break
    if len(interleaved) < 5:
        interleaved += ["France", "Australia", "Brazil", "Spain", "Thailand"][:5-len(interleaved)]
    return ", ".join(interleaved)

def get_destinations(user_input: dict) -> dict:
    interest = user_input.get("interest", "culture and food")
    api_result = get_destinations_from_opentripmap(interest)
    if api_result:
        return {"destinations": api_result}
    db_result = get_destinations_from_db(interest)
    if db_result and db_result.count(',') >= 4:
        return {"destinations": db_result}
    prompt = make_prompt(interest)
    try:
        response = ask_model(prompt)
        destinations = post_process_destinations(response)
        return {"destinations": destinations}
    except Exception as e:
        print(f"Destination LLM error: {e}")
        traceback.print_exc()
        return {"destinations": ", ".join(FALLBACK_DESTINATIONS)}
