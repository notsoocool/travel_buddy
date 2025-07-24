import os
from dotenv import load_dotenv
import requests
from models.flan_wrapper import ask_model

load_dotenv()
OPENTRIPMAP_API_KEY = os.environ.get("OPENTRIPMAP_API_KEY")

# 1. Get coordinates for a city using OpenTripMap geoname endpoint
def get_city_coordinates(city_name):
    url = (
        f"https://api.opentripmap.com/0.1/en/places/geoname"
        f"?apikey={OPENTRIPMAP_API_KEY}&name={city_name}"
    )
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get("lat"), data.get("lon")
    return None, None

def get_top_pois(destination, interest=None, limit=10, radius=20000):
    lat, lon = get_city_coordinates(destination)
    print(f"Coordinates for {destination}: {lat}, {lon}")
    if lat is None or lon is None:
        return []
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
    response = requests.get(url)
    print("OpenTripMap API URL:", url)
    print("Status code:", response.status_code)
    print("Response:", response.text)
    if response.status_code == 200:
        data = response.json()
        # For autosuggest, data['features']; for radius, data is a list
        if isinstance(data, dict) and 'features' in data:
            return [item['properties']['name'] for item in data['features'] if item['properties'].get('name')]
        else:
            return [item['name'] for item in data if item.get('name')]
    return []

# 3. Generate itinerary using LLM and POIs
def generate_itinerary(destination, days, interest="interesting_places"):
    pois = get_top_pois(destination, interest, limit=days*3)
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
        day_pois = pois[poi_idx:poi_idx+3] if poi_idx+3 <= len(pois) else pois[poi_idx:]
        while len(day_pois) < 3:
            for activity in fallback_activities:
                if activity not in day_pois and len(day_pois) < 3:
                    day_pois.append(activity)
        poi_idx += 3
        itinerary.append({
            f"Day {day}": {
                "morning": day_pois[0],
                "afternoon": day_pois[1],
                "evening": day_pois[2]
            }
        })
    return itinerary 