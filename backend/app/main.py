from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, analyze

app = FastAPI()

# 🔥 VERY IMPORTANT (temporary for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ⚠️ first debug এ * use করো
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(analyze.router)

@app.get("/")
def root():
    return {"message": "Resume AI Backend Running 🚀"}