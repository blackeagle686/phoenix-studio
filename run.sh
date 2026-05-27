#!/bin/bash

# Trap SIGINT and SIGTERM to kill background processes on exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

echo "==========================================="
echo "🔥 Starting Phoenix Studio Local Environment"
echo "==========================================="

echo "[1/2] Starting FastAPI Backend on port 8000..."
# Ensure we are in the root directory
cd "$(dirname "$0")"
./venv/bin/uvicorn backend.main:app --port 8000 --reload &

echo "[2/2] Starting Vite Frontend on port 5173..."
cd frontend
npm run dev &

echo "==========================================="
echo "✅ Both servers are starting!"
echo "Press Ctrl+C to stop both servers."
echo "==========================================="

# Wait for background processes to keep the script running
wait
