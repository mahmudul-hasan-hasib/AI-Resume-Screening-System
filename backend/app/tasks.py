from app.celery_app import celery
from app.services.parser import extract_text_from_pdf
from app.services.scorer import calculate_similarity
from app.db import SessionLocal
from app.models import Candidate
import os

UPLOAD_DIR = "uploads"


@celery.task
def analyze_task(job_description, files):
    db = SessionLocal()

    resume_texts = []

    for filename in files:
        file_path = os.path.join(UPLOAD_DIR, filename)

        if not os.path.exists(file_path):
            continue

        try:
            text = extract_text_from_pdf(file_path)
        except Exception:
            continue

        resume_texts.append(text)

    results = calculate_similarity(job_description, resume_texts)

    final = []

    for i, res in enumerate(results):
        score_percent = round(res["score"] * 100, 2)

        candidate = Candidate(
            filename=files[i],
            score=score_percent,
            keywords=",".join(res["matched_keywords"])
        )
        db.add(candidate)

        final.append({
            "filename": files[i],
            "score": score_percent,
            "matched_keywords": res["matched_keywords"]
        })

    db.commit()
    db.close()

    return final