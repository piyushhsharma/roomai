#!/bin/bash
echo "Starting RoomAI development environment..."

# Start backend
echo "Setting up backend..."
cd backend
pip install -r requirements.txt

# Start database migrations
echo "Running database migrations..."
alembic upgrade head &

# Start backend server
echo "Starting FastAPI server..."
uvicorn app.main:app --reload --port 8000 &

# Start Celery worker
echo "Starting Celery worker..."
celery -A app.tasks.celery_app worker --loglevel=info &

# Start frontend
echo "Setting up frontend..."
cd ../frontend
npm install && npm run dev &

echo "RoomAI development environment started!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
