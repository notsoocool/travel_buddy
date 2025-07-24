import os
from dotenv import load_dotenv
from models.flan_wrapper import ask_model
from utils.prompts import make_prompt
import traceback

load_dotenv()
OPENTRIPMAP_API_KEY = os.environ.get("OPENTRIPMAP_API_KEY")

# Fallback activities for different interests
FALLBACK_ACTIVITIES = {
    "interesting_places": [
        "Visit the main square",
        "Explore historical landmarks",
        "Take a guided city tour",
        "Visit a local museum",
        "Walk through the old town"
    ],
    "food_culture": [
        "Try local street food",
        "Visit a traditional restaurant",
        "Take a cooking class",
        "Explore food markets",
        "Sample local desserts"
    ],
    "nature_adventure": [
        "Hike in nearby nature trails",
        "Visit a national park",
        "Go on a nature walk",
        "Explore botanical gardens",
        "Take a scenic drive"
    ],
    "shopping_nightlife": [
        "Visit shopping districts",
        "Explore local markets",
        "Enjoy nightlife venues",
        "Shop for souvenirs",
        "Experience local entertainment"
    ],
    "history_museums": [
        "Visit historical museums",
        "Explore ancient ruins",
        "Take a history tour",
        "Visit cultural sites",
        "Learn about local heritage"
    ]
}

# 1. Get coordinates for a city using OpenTripMap geoname endpoint
def get_city_coordinates(city_name):
    if not OPENTRIPMAP_API_KEY:
        print("Warning: OPENTRIPMAP_API_KEY not found. Using fallback activities.")
        return None, None
        
    url = (
        f"https://api.opentripmap.com/0.1/en/places/geoname"
        f"?apikey={OPENTRIPMAP_API_KEY}&name={city_name}"
    )
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get("lat"), data.get("lon")
    except requests.exceptions.RequestException as e:
        print(f"Error getting coordinates: {e}")
    return None, None

def get_top_pois(destination, interest=None, limit=10, radius=20000):
    if not OPENTRIPMAP_API_KEY:
        print("Warning: OPENTRIPMAP_API_KEY not found. Using fallback activities.")
        return []
        
    lat, lon = get_city_coordinates(destination)
    print(f"Coordinates for {destination}: {lat}, {lon}")
    if lat is None or lon is None:
        return []
        
    try:
        if interest and len(interest) >= 3:
            # Use autosuggest for interest-based search
            url = (
                f"https://api.opentripmap.com/0.1/en/places/autosuggest"
                f"?apikey={OPENTRIPMAP_API_KEY}"
                f"&name={destination}"
                f"&radius={radius}"
                f"&lon={lon}"
                f"&lat={lat}"
                f"&limit={limit}"
                f"&kinds={interest}"
            )
        else:
            # Use radius for general POIs
            url = (
                f"https://api.opentripmap.com/0.1/en/places/radius"
                f"?apikey={OPENTRIPMAP_API_KEY}"
                f"&radius={radius}"
                f"&lon={lon}"
                f"&lat={lat}"
                f"&format=json"
                f"&limit={limit}"
            )
        response = requests.get(url, timeout=10)
        print("OpenTripMap API URL:", url)
        print("Status code:", response.status_code)
        
        if response.status_code == 200:
            data = response.json()
            # For autosuggest, data['features']; for radius, data is a list
            if isinstance(data, dict) and 'features' in data:
                return [item['properties']['name'] for item in data['features'] if item['properties'].get('name')]
            else:
                return [item['name'] for item in data if item.get('name')]
    except requests.exceptions.RequestException as e:
        print(f"Error fetching POIs: {e}")
    return []

def get_fallback_activities(interest="interesting_places", days=3):
    """Get fallback activities when API is not available"""
    activities = FALLBACK_ACTIVITIES.get(interest, FALLBACK_ACTIVITIES["interesting_places"])
    # Repeat activities if needed for more days
    while len(activities) < days * 3:
        activities.extend(activities[:3])
    return activities[:days * 3]

# 3. Generate itinerary using LLM and POIs
def generate_itinerary(destination, days, interest="interesting_places"):
    prompt = (
        f"You are a travel expert. Create a detailed {days}-day itinerary for a trip to {destination} "
        f"focused on {interest.replace('_', ' ')}. For each day, suggest morning, afternoon, and evening activities. "
        f"Be specific, creative, and include local experiences. Format as:\n"
        f"Day 1: Morning - ...; Afternoon - ...; Evening - ...\nDay 2: ...\n...\n"
        f"Do not include any extra commentary."
    )
    try:
        llm_response = ask_model(prompt)
        # Return the LLM's formatted itinerary directly
        return llm_response.strip()
    except Exception as e:
        print(f"Itinerary LLM error: {e}")
        traceback.print_exc()
        # Fallback: simple generated itinerary
        activities = get_fallback_activities(interest, days)
        fallback_activities = [
            "Explore a local café",
            "Take a city walk",
            "Visit a local market",
            "Relax in a park",
            "Try a local restaurant"
        ]
        itinerary = []
        poi_idx = 0
        for day in range(1, days+1):
            day_pois = activities[poi_idx:poi_idx+3] if poi_idx+3 <= len(activities) else activities[poi_idx:]
            while len(day_pois) < 3:
                for activity in fallback_activities:
                    if activity not in day_pois and len(day_pois) < 3:
                        day_pois.append(activity)
                        break
            poi_idx += 3
            itinerary.append(f"Day {day}: Morning - {day_pois[0] if len(day_pois) > 0 else 'Start your day'}; "
                             f"Afternoon - {day_pois[1] if len(day_pois) > 1 else 'Explore the city'}; "
                             f"Evening - {day_pois[2] if len(day_pois) > 2 else 'Enjoy local cuisine'}")
        return "\n".join(itinerary) 