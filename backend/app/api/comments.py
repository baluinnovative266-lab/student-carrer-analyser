from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class Comment(BaseModel):
    user_id: Optional[str] = "anonymous"
    phase_id: str
    content: str
    timestamp: datetime = datetime.now()

# In-memory storage for demo purposes (replace with DB in production)
comments_db = []

@router.post("/comments", response_model=dict)
async def add_comment(comment: Comment):
    comments_db.append(comment.dict())
    return {"success": True, "message": "Comment added successfully"}

@router.get("/comments/{phase_id}", response_model=List[dict])
async def get_comments(phase_id: str):
    return [c for c in comments_db if c["phase_id"] == phase_id]
