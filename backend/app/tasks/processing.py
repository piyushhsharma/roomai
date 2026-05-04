from celery import current_task
from app.tasks.celery_app import celery_app
from app.core.database import async_session_maker
from app.models.models import DesignJob, JobStatus
from app.ai_integration import AIImageGenerator
from app.mock_products import get_products_by_theme
from sqlalchemy.ext.asyncio import AsyncSession
import json
import time
import os

@celery_app.task(bind=True)
def process_design_job(self, job_id: str):
    """Process a design job through the AI pipeline"""
    
    async def update_job_status(status: JobStatus, message: str = None):
        async with async_session_maker() as db:
            job = await db.get(DesignJob, job_id)
            if job:
                job.status = status
                if message:
                    # In a real implementation, this would trigger SSE updates
                    pass
                await db.commit()
    
    async def run_pipeline():
        try:
            ai_generator = AIImageGenerator()
            
            # Get job details
            async with async_session_maker() as db:
                job = await db.get(DesignJob, job_id)
                if not job:
                    raise Exception("Job not found")
                
                theme = job.theme
                colors = job.color_preferences
                budget_min = job.budget_min
                budget_max = job.budget_max
            
            # Step 1: CV Analysis
            await update_job_status(JobStatus.PROCESSING)
            time.sleep(2)  # Simulate processing
            
            cv_result = await ai_generator.analyze_room_image(job.original_image_url)
            
            async with async_session_maker() as db:
                job = await db.get(DesignJob, job_id)
                job.cv_analysis = cv_result
                await db.commit()
            
            await update_job_status(JobStatus.CV_DONE)
            
            # Step 2: Image Generation
            await update_job_status(JobStatus.GENERATING)
            time.sleep(3)  # Simulate processing
            
            prompt = ai_generator.generate_image_prompt(theme, colors)
            generated_image_url = await ai_generator.generate_image(prompt)
            
            async with async_session_maker() as db:
                job = await db.get(DesignJob, job_id)
                job.generated_image_url = generated_image_url
                await db.commit()
            
            # Step 3: Object Detection
            await update_job_status(JobStatus.MATCHING)
            time.sleep(2)  # Simulate processing
            
            detected_objects = await ai_generator.detect_objects(generated_image_url)
            
            async with async_session_maker() as db:
                job = await db.get(DesignJob, job_id)
                job.detected_objects = detected_objects
                await db.commit()
            
            # Step 4: Product Matching
            time.sleep(2)  # Simulate processing
            products = get_products_by_theme(theme, budget_min, budget_max)
            
            async with async_session_maker() as db:
                job = await db.get(DesignJob, job_id)
                job.products = products
                await db.commit()
            
            # Complete
            await update_job_status(JobStatus.COMPLETE)
            
        except Exception as e:
            async with async_session_maker() as db:
                job = await db.get(DesignJob, job_id)
                if job:
                    job.status = JobStatus.FAILED
                    job.error_message = str(e)
                    await db.commit()
    
    # Run the async pipeline
    import asyncio
    asyncio.run(run_pipeline())
