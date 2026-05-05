from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, analyze
from app.db import engine
from app.models import Base
from app.routes import results

app = FastAPI()

# 🔥 DB init (better)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # dev
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
    return {"message": "Resume AI Backend Running 🚀"}