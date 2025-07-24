# schemas/destination_schema.py

from pydantic import BaseModel

class DestinationRequest(BaseModel):
    interest: str

class BudgetRequest(BaseModel):
    destination: str = "Paris"
    days: int = 5
    style: str = "mid-range"

class ItineraryRequest(BaseModel):
    destination: str
    days: int
    interest: str = "interesting_places"