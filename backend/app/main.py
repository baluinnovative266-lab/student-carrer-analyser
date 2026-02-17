from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes

app = FastAPI(title="CareerSense AI API", version="1.0.0")

# CORS Middleware
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to CareerSense AI API"}

from app.core.database import engine, Base
from app.api import auth

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(routes.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
