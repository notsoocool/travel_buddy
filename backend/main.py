# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents.destination_agent import get_destinations
from schemas.all_schemas import DestinationRequest, BudgetRequest, ItineraryRequest
from fastapi import Request
from agents.budget_agent import suggest_budget
from agents.itenary_agent import generate_itinerary

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Travel Buddy AI"}

@app.post("/suggest-destinations")
def suggest_destinations(data: DestinationRequest):
    return get_destinations(data.dict())

@app.post("/budget")
def get_budget(data: BudgetRequest):
    return suggest_budget(data.destination, data.days, data.style)

@app.post("/itinerary")
def get_itinerary(data: ItineraryRequest):
    result = generate_itinerary(data.destination, data.days, data.interest)
    return {"itinerary": result}