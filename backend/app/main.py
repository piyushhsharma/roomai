from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.models import DesignJob
from app.tasks.celery_app import celery_app
from app.tasks.processing import process_design_job
import json
import asyncio
from typing import Optional
import uuid

app = FastAPI(title="RoomAI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/jobs")
async def create_job(
    image: UploadFile = File(...),
    theme: str = Form(...),
    colors: str = Form(...),
    budget_min: int = Form(...),
    budget_max: int = Form(...),
    db: AsyncSession = get_db()
):
    try:
        # Save uploaded image
        file_extension = image.filename.split(".")[-1].lower()
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{filename}"
        
        with open(file_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
        
        # Parse colors JSON
        colors_list = json.loads(colors)
        
        # Create job record
        job = DesignJob(
            original_image_url=file_path,
            theme=theme,
            color_preferences=colors_list,
            budget_min=budget_min,
            budget_max=budget_max,
            status="pending"
        )
        
        db.add(job)
        await db.commit()
        await db.refresh(job)
        
        # Enqueue processing task
        process_design_job.delay(str(job.id))
        
        return {
            "job_id": str(job.id),
            "status": job.status,
            "estimated_time_seconds": 120
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str, db: AsyncSession = get_db()):
    try:
        job = await db.get(DesignJob, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return {
            "id": str(job.id),
            "status": job.status,
            "original_image_url": job.original_image_url,
            "generated_image_url": job.generated_image_url,
            "theme": job.theme,
            "color_preferences": job.color_preferences,
            "budget_min": job.budget_min,
            "budget_max": job.budget_max,
            "cv_analysis": job.cv_analysis,
            "detected_objects": job.detected_objects,
            "products": job.products,
            "error_message": job.error_message,
            "created_at": job.created_at,
            "updated_at": job.updated_at
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/jobs/{job_id}/stream")
async def stream_job_status(job_id: str):
    async def generate():
        # This would normally use Redis or similar for real-time updates
        # For now, we'll just send periodic updates
        statuses = [
            {"event": "status_update", "data": {"status": "pending", "message": "Job queued", "progress_percent": 0}},
            {"event": "status_update", "data": {"status": "processing", "message": "Analyzing your room...", "progress_percent": 20}},
            {"event": "status_update", "data": {"status": "cv_done", "message": "Understanding layout and furniture...", "progress_percent": 40}},
            {"event": "status_update", "data": {"status": "generating", "message": "Generating your redesign...", "progress_percent": 70}},
            {"event": "status_update", "data": {"status": "matching", "message": "Finding matching products...", "progress_percent": 85}},
            {"event": "status_update", "data": {"status": "complete", "message": "Your redesign is ready!", "progress_percent": 100}}
        ]
        
        for status in statuses:
            yield f"data: {json.dumps(status)}\n\n"
            await asyncio.sleep(2)  # Simulate processing time
    
    return StreamingResponse(generate(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
