from fastapi import APIRouter, UploadFile, File
from typing import List
import os
from app.services.parser import extract_text_from_pdf

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-cv")
async def upload_cv(files: List[UploadFile] = File(...)):
    results = []

    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # 🔥 Extract text
        extracted_text = extract_text_from_pdf(file_path)

        results.append({
            "filename": file.filename,
            "text_preview": extracted_text[:500]  # preview only
        })

    return {
        "message": "Files uploaded & parsed",
        "data": results
    }