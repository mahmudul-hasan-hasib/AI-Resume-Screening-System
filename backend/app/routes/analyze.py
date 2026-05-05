from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import os

from app.services.parser import extract_text_from_pdf
from app.services.scorer import calculate_similarity

router = APIRouter()


class AnalyzeRequest(BaseModel):
    job_description: str
    files: List[str]


@router.post("/analyze")
def analyze(data: AnalyzeRequest):
    resume_texts = []

    for filename in data.files:
        file_path = os.path.join("uploads", filename)
        text = extract_text_from_pdf(file_path)
        resume_texts.append(text)

    scores = calculate_similarity(data.job_description, resume_texts)

    results = []
    for i, score in enumerate(scores):
        results.append({
            "filename": data.files[i],
            "score": round(score * 100, 2)
        })

    return {
        "results": results
    }