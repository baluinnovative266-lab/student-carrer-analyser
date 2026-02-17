from pydantic import BaseModel
from typing import List, Optional

class StudentProfile(BaseModel):
    name: str
    email: str

class CareerInput(BaseModel):
    math_score: int
    programming_score: int
    communication_score: int
    problem_solving_score: int
    interest_coding: int
    interest_design: int
    interest_management: int

class CareerProbability(BaseModel):
    name: str
    prob: float

class CareerPredictionResponse(BaseModel):
    predicted_career: str
    confidence: Optional[float] = None
    probabilities: List[CareerProbability] = []
    extracted_skills: List[str] = []
    missing_skills: List[str] = []
    recommended_roadmap: List[str] = []
    radar_data: List[dict] = []

class SkillGapResponse(BaseModel):
    extracted_skills: List[str]
    missing_skills: List[str]
    recommended_roadmap: List[str]
    radar_data: List[dict] = []
