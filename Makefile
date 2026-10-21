.PHONY: help install dev test test-backend test-frontend build docker-up docker-down clean

help:
	@echo "Deep Research AI - Developer Makefile"
	@echo "  make install        - Install backend and frontend dependencies"
	@echo "  make dev            - Run backend and frontend concurrently"
	@echo "  make dev-backend    - Run FastAPI backend development server"
	@echo "  make dev-frontend   - Run Vite frontend development server"
	@echo "  make test           - Run all backend and frontend tests"
	@echo "  make test-backend   - Run pytest on backend"
	@echo "  make test-frontend  - Run vitest on frontend"
	@echo "  make build          - Build frontend production distribution"
	@echo "  make docker-up      - Start full stack via docker-compose"
	@echo "  make docker-down    - Stop docker-compose services"
	@echo "  make clean          - Remove temporary build artifacts"

install:
	@echo "Installing backend dependencies..."
	cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev-backend:
	cd backend && .venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

test-backend:
	cd backend && .venv/bin/pytest tests/ -v

test-frontend:
	cd frontend && npm run test

test: test-backend test-frontend

build:
	cd frontend && npm run build

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

clean:
	rm -rf frontend/dist backend/__pycache__ backend/app/__pycache__ backend/.pytest_cache
