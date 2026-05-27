#!/bin/bash

# Configuration
PROJECT_DIR="/home/tlk/Documents/Projects/my_AItools/phoenix-studio"
VENV_DIR="$PROJECT_DIR/venv"
LOGS_DIR="$PROJECT_DIR/logs"
NGROK_TOKEN="3EK4AEsl1EbIFf7EL1tjvKovZOS_4cnZrmFpqW3giU8AXtBTQ"

mkdir -p "$LOGS_DIR"

command=$1
service=$2

function deploy() {
    echo "Starting deployment setup..."
    
    # Check if redis-server is installed
    if ! command -v redis-server &> /dev/null; then
        echo "Redis is not installed. Attempting to install redis-server..."
        sudo apt-get update
        sudo apt-get install -y redis-server
    fi
    
    # Initialize redis
    sudo systemctl enable redis-server || echo "Systemd not available, skipping enable"
    sudo systemctl start redis-server || sudo service redis-server start
    
    # Create venv
    if [ ! -d "$VENV_DIR" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv "$VENV_DIR"
    fi
    
    # Install dependencies
    echo "Installing dependencies..."
    source "$VENV_DIR/bin/activate"
    cd "$PROJECT_DIR/backend"
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Ngrok setup
    if ! command -v ngrok &> /dev/null; then
        echo "Installing ngrok..."
        curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
          | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
          && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
          | sudo tee /etc/apt/sources.list.d/ngrok.list \
          && sudo apt update \
          && sudo apt install ngrok
    fi
    
    ngrok config add-authtoken "$NGROK_TOKEN"
    
    echo "Deployment setup complete. Run './deploy.sh start' to start services."
}

function start() {
    echo "Starting services in the background..."
    source "$VENV_DIR/bin/activate"
    
    # Start Backend
    cd "$PROJECT_DIR"
    nohup uvicorn backend.main:app --host 0.0.0.0 --port 8000 > "$LOGS_DIR/backend.log" 2>&1 &
    echo $! > "$LOGS_DIR/backend.pid"
    echo "Backend started."

    # Start Celery
    nohup celery -A backend.core.celery_app worker --loglevel=info > "$LOGS_DIR/celery.log" 2>&1 &
    echo $! > "$LOGS_DIR/celery.pid"
    echo "Celery worker started."
    
    # Start Ngrok
    nohup ngrok http 8010 --log stdout --log-format logfmt > "$LOGS_DIR/ngrok.log" 2>&1 &
    echo $! > "$LOGS_DIR/ngrok.pid"
    echo "Ngrok started. Use './deploy.sh logs ngrok' to see the forwarding URL."
}

function stop() {
    echo "Stopping services..."
    for svc in backend celery ngrok; do
        if [ -f "$LOGS_DIR/$svc.pid" ]; then
            PID=$(cat "$LOGS_DIR/$svc.pid")
            if ps -p $PID > /dev/null; then
                kill $PID
                echo "$svc stopped."
            else
                echo "$svc was not running."
            fi
            rm "$LOGS_DIR/$svc.pid"
        else
            echo "No PID file found for $svc."
        fi
    done
    
    # Extra safety kill
    pkill -f "uvicorn backend.main:app" || true
    pkill -f "celery -A backend.core.celery_app" || true
    pkill -f "ngrok http" || true
}

function restart() {
    stop
    sleep 2
    start
}

function logs() {
    if [ -z "$service" ]; then
        echo "Please specify a service to view logs: backend, celery, or ngrok"
        echo "Usage: ./deploy.sh logs [backend|celery|ngrok]"
        exit 1
    fi
    
    if [ -f "$LOGS_DIR/$service.log" ]; then
        tail -f "$LOGS_DIR/$service.log"
    else
        echo "Log file for $service not found."
    fi
}

case $command in
    deploy)
        deploy
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    *)
        echo "Usage: ./deploy.sh {deploy|start|stop|restart|logs [service]}"
        exit 1
esac
