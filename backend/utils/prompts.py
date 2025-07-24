def make_prompt(interest):
    return (
        f"You are a travel expert. Suggest 5 different travel destinations for someone interested in {interest}.\n"
        "List only the names, separated by commas. Do not repeat any destination."
    )
    
def get_budget_prompt(destination, days, travel_style):
    return (
        f"As a travel budget planner AI, suggest an estimated budget (in INR) "
        f"for a trip to {destination} for {days} days. The travel style is '{travel_style}'. "
        f"Consider flight, stay, food, transport, and misc expenses. "
        f"Respond with only a number, no words or symbols."
    )
