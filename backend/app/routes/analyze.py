from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.tasks import analyze_task
from celery.result import AsyncResult
from app.celery_app import celery


router = APIRouter()


class AnalyzeRequest(BaseModel):
    job_description: str
    files: List[str]


@router.post("/analyze")
def analyze(data: AnalyzeRequest):

    if not data.files:
        raise HTTPException(status_code=400, detail="No files provided")

    if not data.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is empty")

    task = analyze_task.delay(data.job_description, data.files)

    return {
        "task_id": task.id,
        "message": "Processing started"
    }


@router.get("/task-status/{task_id}")
def get_status(task_id: str):
    task = AsyncResult(task_id, app=celery)

    return {
        "status": task.status,
        "result": task.result if task.status == "SUCCESS" else None
    }