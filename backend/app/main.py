from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import upload, analyze, results
from app.db import engine
from app.models import Base

app = FastAPI()

# 🔥 DB init
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-resume-screening-system-sepia.vercel.app",
        "https://ai-resume-screening-system-dhrm6nesw.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Routes
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(results.router)

@app.get("/")
def root():
    return {
        "message": "Resume AI Backend Running 🚀"
    }