from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, get_current_user_optional
from app.models.user import User
from typing import Optional, List, Any
from fastapi.responses import JSONResponse
from app.models.api_schemas import CareerInput, CareerPredictionResponse, SkillGapResponse
from app.services.ml_service import career_predictor
from app.services.resume_parser import resume_parser
from app.logic.roadmap_engine import roadmap_engine

router = APIRouter()

@router.post("/predict-career", response_model=CareerPredictionResponse)
def predict_career(input_data: CareerInput, current_user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    try:
        if hasattr(input_data, "model_dump"):
            input_dict = input_data.model_dump()
        elif hasattr(input_data, "dict"):
            input_dict = input_data.dict()
        else:
            input_dict = dict(input_data)
    except:
        input_dict = {}
        
    result = career_predictor.predict(input_dict)
    predicted_career = result.get("predicted_career", "General Analyst")
    
    scores_dict = {
        "programming": input_data.programming_score,
        "math": input_data.math_score,
        "communication": input_data.communication_score,
        "logic": input_data.problem_solving_score,
        "design": input_data.interest_design * 10
    }
    
    confidence_score = result.get("confidence", 0.85)
    roadmap = roadmap_engine.generate(predicted_career, scores_dict, [], confidence=confidence_score)
    
    if current_user:
        current_user.predicted_career = predicted_career
        db.commit()
    
    career_match = confidence_score * 100
    radar_data = [
        {"subject": "Programming", "A": scores_dict["programming"], "fullMark": 100},
        {"subject": "Math", "A": scores_dict["math"], "fullMark": 100},
        {"subject": "Communication", "A": scores_dict["communication"], "fullMark": 100},
        {"subject": "Problem Solving", "A": scores_dict["logic"], "fullMark": 100},
        {"subject": "Design", "A": scores_dict["design"], "fullMark": 100}
    ]
    
    probability_chart_data = [
        {"career": p["name"], "probability": p["prob"]} 
        for p in result.get("probabilities", [])[:5]
    ]

    skill_comparison_data = [
        {"skill": "Logic", "yourScore": scores_dict["logic"], "required": 85},
        {"skill": "Math", "yourScore": scores_dict["math"], "required": 75},
        {"skill": "Comm", "yourScore": scores_dict["communication"], "required": 70}
    ]

    next_recommended_skill = roadmap[0]["steps"][0]["skill"] if roadmap and roadmap[0]["steps"] else "Python"

    return {
        "predicted_career": predicted_career,
        "confidence": result.get("probabilities")[0].get("prob") / 100 if result.get("probabilities") else 0.8,
        "probabilities": result.get("probabilities", []),
        "extracted_skills": [], 
        "missing_skills": ["Python", "Algorithms", "Databases"], 
        "recommended_roadmap": roadmap,
        "radar_data": radar_data,
        "career_match_score": career_match,
        "next_recommended_skill": next_recommended_skill,
        "probability_chart_data": probability_chart_data,
        "skill_comparison_data": skill_comparison_data
    }

@router.post("/analyze-resume", response_model=SkillGapResponse)
async def analyze_resume(file: UploadFile = File(...), current_user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    contents = await file.read()
    text = ""
    try:
        filename = file.filename.lower()
        if filename.endswith('.pdf'):
            text = resume_parser.extract_text_from_pdf(contents)
        elif filename.endswith('.docx'):
            text = resume_parser.extract_text_from_docx(contents)
        else:
            text = contents.decode("utf-8")
    except:
        return JSONResponse(status_code=400, content={"success": False, "message": "Extraction failed"})

    if not text:
         return JSONResponse(status_code=400, content={"success": False, "message": "No text detected"})

    extracted_skills = resume_parser.extract_skills(text)
    target_career = "Software Engineer"
    existing_skill_names = [s["name"].lower() for s in extracted_skills]
    
    if any(s in ["design", "figma", "ui", "ux"] for s in existing_skill_names):
        target_career = "UI/UX Designer"
    elif any(s in ["data", "ml", "python", "sql"] for s in existing_skill_names):
        target_career = "Data Scientist"
    
    roadmap = roadmap_engine.generate(target_career, {"programming": 60, "soft skills": 80}, existing_skill_names)
    
    radar_data = [
        {"subject": "Tech", "A": 65, "fullMark": 100},
        {"subject": "Soft Skills", "A": 80, "fullMark": 100},
        {"subject": "Experience", "A": 40, "fullMark": 100}
    ]
    
    if current_user:
        current_user.predicted_career = target_career
        db.commit()
    
    return {
        "extracted_skills": extracted_skills,
        "missing_skills": ["Scaling", "DevOps", "Advanced Algorithms"],
        "recommended_roadmap": roadmap,
        "radar_data": radar_data
    }
