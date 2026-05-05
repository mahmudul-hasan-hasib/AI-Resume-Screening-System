from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import os

from app.services.parser import extract_text_from_pdf
from app.services.scorer import calculate_similarity

router = APIRouter()

UPLOAD_DIR = "uploads"


class AnalyzeRequest(BaseModel):
    job_description: str
    files: List[str]


@router.post("/analyze")
def analyze(data: AnalyzeRequest):
    resume_texts = []

    # 🔍 Validation
    if not data.files:
        raise HTTPException(status_code=400, detail="No files provided")

    if not data.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is empty")

    # 📄 Extract text
    for filename in data.files:
        file_path = os.path.join(UPLOAD_DIR, filename)

        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=404,
                detail=f"File not found: {filename}"
            )

        try:
            text = extract_text_from_pdf(file_path)
        except Exception:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse {filename}"
            )

        resume_texts.append(text)

    # 🧠 Scoring (UPDATED)
    results = calculate_similarity(data.job_description, resume_texts)

    # 🔥 FINAL RESPONSE FORMAT
    final = []
    for i, res in enumerate(results):
        final.append({
            "filename": data.files[i],
            "score": round(res["score"] * 100, 2),   # percentage
            "matched_keywords": res["matched_keywords"]
        })

    # 🔽 sort by best match
    final = sorted(final, key=lambda x: x["score"], reverse=True)

    return {"results": final}