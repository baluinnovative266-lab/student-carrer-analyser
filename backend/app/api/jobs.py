from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.roadmap import Roadmap
from app.services.job_service import job_service

router = APIRouter()

@router.get("/match")
def get_job_matches(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetch personalized job matches based on user career path and completed skills."""
    
    # Get user's active roadmap to find career path and completed phases
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
    
    if not roadmap:
        return {"matches": [], "message": "No active roadmap found. Complete analysis first."}
    
    # Extract "completed" skills from roadmap phases
    # For now, we'll look at the content field which is a list of phases
    completed_skills = []
    # If the user has a career path, they have a baseline
    career_path = roadmap.career_path
    
    # Logic: If phase is "completed" (needs a new field in Roadmap model or handled via frontend state)
    # Since we don't have a 'completed' flag on phases in DB yet, we'll mock based on predicted_career
    # In a real scenario, we'd check which steps are checked off.
    
    # Let's assume the user has some baseline skills from their 'extracted_skills' if they did analysis
    # For this mock implementation, we'll provide a few skills if they have an active roadmap
    user_skills = ["Python", "JavaScript", "HTML/CSS"] # Baseline
    
    matches = job_service.get_matches(career_path, user_skills)
    
    return {
        "career_path": career_path,
        "matches": matches
    }

@router.get("/companies/by-skill")
def get_companies_by_skill(career_path: str):
    """Get companies hiring for a specific career path/skill set."""
    companies = job_service.get_companies_by_career(career_path)
    if not companies:
        raise HTTPException(status_code=404, detail="No companies found for this career path")
    return companies
