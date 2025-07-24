import re
from models.flan_wrapper import ask_model as generate_flan_response
from utils.prompts import get_budget_prompt

# Fallback cost logic for when LLM is not available
DESTINATION_BASE_COST = {
    "paris": 20000,
    "peru": 15000,
    "japan": 25000,
    "nepal": 8000,
    "thailand": 9000,
    "bali": 12000,
    "singapore": 18000,
    "dubai": 22000,
    "new york": 30000,
    "london": 28000,
    "australia": 35000,
    "canada": 25000,
    "brazil": 16000,
    "mexico": 14000,
    "italy": 20000,
    "spain": 18000,
    "greece": 16000,
    "turkey": 12000,
    "india": 8000,
    "china": 15000
}

STYLE_MULTIPLIER = {
    "budget": 0.8,
    "mid-range": 1.0,
    "luxury": 1.5,
}

def calculate_budget(destination, days, style):
    base = DESTINATION_BASE_COST.get(destination.lower(), 10000)
    multiplier = STYLE_MULTIPLIER.get(style.lower(), 1.0)
    return int(base * days * multiplier)

def suggest_budget(destination: str, days: int, travel_style: str) -> dict:
    prompt = get_budget_prompt(destination, days, travel_style)
    try:
        llm_response = generate_flan_response(prompt)
        match = re.search(r"[\d,]+", llm_response)
        if match:
            budget = match.group(0).replace(",", "")
            budget = int(budget)
        else:
            # fallback to classic calculation if LLM response is not a number
            budget = calculate_budget(destination, days, travel_style)
        return {
            "budget": f"Estimated budget for your trip to {destination} for {days} days ({travel_style}): ₹{budget}",
            "llm_raw": llm_response,
            "disclaimer": "This is an AI-generated estimate. Actual prices may vary."
        }
    except Exception as e:
        print(f"Budget LLM error: {e}")
        budget = calculate_budget(destination, days, travel_style)
        return {
            "budget": f"Estimated budget for your trip to {destination} for {days} days ({travel_style}): ₹{budget}",
            "llm_raw": None,
            "disclaimer": "This is a fallback estimate. Actual prices may vary."
        }
