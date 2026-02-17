from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.comment import Comment as CommentModel
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class CommentCreate(BaseModel):
    phase_id: str
    content: str
    pros: Optional[str] = None
    cons: Optional[str] = None

class CommentResponse(BaseModel):
    id: int
    user_name: str
    phase_id: str
    content: Optional[str] = None
    pros: Optional[str] = None
    cons: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

@router.post("/comments", response_model=dict)
async def add_comment(comment: CommentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_comment = CommentModel(
        user_id=current_user.id,
        phase_id=comment.phase_id,
        content=comment.content,
        pros=comment.pros,
        cons=comment.cons
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return {"success": True, "message": "Comment added successfully", "id": new_comment.id}

@router.get("/comments/{phase_id}", response_model=List[CommentResponse])
async def get_comments(phase_id: str, db: Session = Depends(get_db)):
    comments = db.query(CommentModel).filter(CommentModel.phase_id == phase_id).order_by(CommentModel.created_at.desc()).all()
    
    return [
        CommentResponse(
            id=c.id, 
            user_name=c.user.full_name if c.user else "Anonymous",
            phase_id=c.phase_id,
            content=c.content,
            pros=c.pros,
            cons=c.cons,
            timestamp=c.created_at
        )
        for c in comments
    ]
