import json
from typing import Any, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "Project Atlas"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    ENVIRONMENT: Literal["development", "test", "staging", "production"] = "development"
    LOG_LEVEL: str = "INFO"

    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # PostgreSQL Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "atlas"
    POSTGRES_PASSWORD: str = "atlas_dev_password_change_me"
    POSTGRES_DB: str = "atlas_db"

    # ADR-003: Development Identity Configuration
    ENABLE_DEV_IDENTITY: bool = True
    DEV_IDENTITY_SUBJECT: str = "local-operator"
    DEV_IDENTITY_NAME: str = "Local Operator"
    DEV_IDENTITY_ROLES: list[str] = Field(default_factory=lambda: ["C0_OPERATOR"])
    DEV_IDENTITY_SCOPES: list[str] = Field(default_factory=lambda: ["identity.self.read"])

    @field_validator("DEV_IDENTITY_ROLES", "DEV_IDENTITY_SCOPES", mode="before")
    @classmethod
    def parse_list_from_env(cls, v: Any) -> list[str]:
        """Robustly parses list fields from strings, JSON arrays, or comma-separated values."""
        if isinstance(v, str):
            v_str = v.strip()
            if not v_str:
                return []
            if v_str.startswith("[") and v_str.endswith("]"):
                try:
                    parsed = json.loads(v_str)
                    if isinstance(parsed, list):
                        return [str(item) for item in parsed]
                except Exception:
                    pass
            return [s.strip() for s in v_str.split(",") if s.strip()]
        if isinstance(v, list):
            return [str(item) for item in v]
        return []

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @model_validator(mode="after")
    def validate_production_identity_safety(self) -> "Settings":
        """ADR-003 Guardrail: Enabling dev identity in production is a critical config error."""
        if self.ENVIRONMENT == "production" and self.ENABLE_DEV_IDENTITY:
            raise ValueError(
                "CRITICAL SECURITY CONFIGURATION ERROR: ENABLE_DEV_IDENTITY cannot be true "
                "when ENVIRONMENT is 'production'. Development identity is prohibited in production."
            )
        return self


settings = Settings()
