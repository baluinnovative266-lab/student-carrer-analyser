from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)
    predicted_career = Column(String(255), nullable=True)

    roadmaps = relationship("Roadmap", back_populates="user")
    comments = relationship("Comment", back_populates="user")
