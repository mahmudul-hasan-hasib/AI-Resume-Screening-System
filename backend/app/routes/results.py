from fastapi import APIRouter, HTTPException
from app.db import SessionLocal
from app.models import Candidate

router = APIRouter()


@router.get("/results")
def get_results():
    db = SessionLocal()

    try:
        data = db.query(Candidate).order_by(Candidate.score.desc()).limit(50).all()

        results = []
        for c in data:
            results.append({
                "filename": c.filename,
                "score": c.score,
                "keywords": c.keywords.split(",") if c.keywords else []
            })

        return {"results": results}

    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch results")

    finally:
        db.close()