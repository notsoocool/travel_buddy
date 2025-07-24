import re
from models.flan_wrapper import ask_model as generate_flan_response
from utils.prompts import get_budget_prompt


DESTINATION_BASE_COST = {
    "paris": 20000,
    "peru": 15000,
    "japan": 25000,
    "nepal": 8000,
    "thailand": 9000,
    # ... add more
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
    budget = calculate_budget(destination, days, travel_style)
    return {
        "budget": f"Estimated budget for your trip to {destination} is ₹{budget}",
        "disclaimer": "This is an estimated calculation based on typical costs. Actual prices may vary."
    }
