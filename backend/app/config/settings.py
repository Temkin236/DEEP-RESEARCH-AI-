from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List
import os

class Settings(BaseSettings):
    ENVIRONMENT: str = Field(default="development")
    LOG_LEVEL: str = Field(default="INFO")
    APP_HOST: str = Field(default="0.0.0.0")
    APP_PORT: int = Field(default=8000)
    FRONTEND_URL: str = Field(default="http://localhost:3000")
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Primary LLM Provider: "gemini", "openai", or "demo"
    LLM_PROVIDER: str = Field(default="gemini")
    GEMINI_API_KEY: str = Field(default="")
    GEMINI_MODEL: str = Field(default="gemini-1.5-flash")

    # Optional OpenAI Provider
    OPENAI_API_KEY: str = Field(default="")
    OPENAI_MODEL: str = Field(default="gpt-4o-mini")

    # Search Provider: "duckduckgo", "tavily", "serper", or "demo"
    SEARCH_PROVIDER: str = Field(default="duckduckgo")
    TAVILY_API_KEY: str = Field(default="")
    SERPER_API_KEY: str = Field(default="")

    # Database
    DATABASE_URL: str = Field(default="sqlite:///./deep_research.db")

    # Chroma persistence directory
    CHROMA_PERSIST_DIRECTORY: str = Field(default="./chroma_db")

    # Document upload directory & limits
    UPLOAD_DIRECTORY: str = Field(default="./uploads")
    MAX_UPLOAD_SIZE_MB: int = Field(default=25)
    MAX_CHUNKS_PER_QUERY: int = Field(default=5)

    # Workflow limits
    MAX_RESEARCH_ITERATIONS: int = Field(default=2)
    MAX_SOURCES_PER_QUERY: int = Field(default=8)
    RESEARCH_TIMEOUT_SECONDS: int = Field(default=180)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
