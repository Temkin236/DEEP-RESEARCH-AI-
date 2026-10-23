.PHONY: help install dev test test-backend test-frontend build docker-up docker-down clean demo showcase

help:
	@echo "Deep Research AI - Developer Makefile"
	@echo "  make install        - Install backend and frontend dependencies"
	@echo "  make dev            - Run backend and frontend concurrently"
	@echo "  make dev-backend    - Run FastAPI backend development server"
	@echo "  make dev-frontend   - Run Vite frontend development server"
	@echo "  make test           - Run all backend and frontend tests"
	@echo "  make test-backend   - Run pytest on backend"
	@echo "  make test-frontend  - Run vitest on frontend"
	@echo "  make demo           - Run end-to-end curriculum milestone verification (Week 3 to 13)"
	@echo "  make showcase       - Generate showcase presentation and review final artifacts"
	@echo "  make build          - Build frontend production distribution"
	@echo "  make docker-up      - Start full stack via docker-compose"
	@echo "  make docker-down    - Stop docker-compose services"
	@echo "  make clean          - Remove temporary build artifacts"

install:
	@echo "Installing backend dependencies..."
	cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev:
	@echo "Starting TechResearch Agent backend and frontend concurrently..."
	@bash -c "trap 'kill 0' SIGINT SIGTERM EXIT; (cd backend && .venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) & (cd frontend && npm run dev) & wait"

dev-backend:
	cd backend && .venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

test-backend:
	cd backend && .venv/bin/pytest tests/ -v

test-frontend:
	cd frontend && npm run test

test: test-backend test-frontend

demo:
	cd backend && .venv/bin/python ../scripts/demo_showcase.py

showcase:
	cd backend && .venv/bin/python ../scripts/generate_presentation.py
	@echo "Showcase presentation generated at docs/Deep_Research_AI_Showcase.pptx"
	@echo "Review showcase documentation at docs/SHOWCASE.md"

build:
	cd frontend && npm run build

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

clean:
	rm -rf frontend/dist backend/__pycache__ backend/app/__pycache__ backend/.pytest_cache
