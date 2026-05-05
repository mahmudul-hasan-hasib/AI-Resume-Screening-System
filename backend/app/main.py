from fastapi import FastAPI
from app.routes import upload
from app.routes import analyze
app = FastAPI()

app.include_router(upload.router)

app.include_router(analyze.router)

@app.get("/")
def root():
    return {"message": "Resume AI Backend Running 🚀"}