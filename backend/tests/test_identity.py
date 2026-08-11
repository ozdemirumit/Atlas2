import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_dev_identity_endpoint(client: AsyncClient) -> None:
    """Verifies that /api/v1/identity/me returns the Local Operator development identity (ADR-003)."""
    response = await client.get("/api/v1/identity/me")
    assert response.status_code == 200
    data = response.json()
    assert data["subject_id"] == "local-operator"
    assert data["display_name"] == "Local Operator"
    assert data["max_capability_class"] == "C0"
    assert data["is_development_identity"] is True


@pytest.mark.asyncio
async def test_bearer_token_rejected_without_adapter(client: AsyncClient) -> None:
    """Verifies ADR-003 rule: Presented bearer tokens are rejected until a real identity adapter exists."""
    headers = {"Authorization": "Bearer fake_test_token_123"}
    response = await client.get("/api/v1/identity/me", headers=headers)
    assert response.status_code == 401
    assert "Bearer token validation requires enterprise identity adapter" in response.json()["detail"]


def test_production_dev_identity_guardrail() -> None:
    """Verifies ADR-003 invariant: Dev identity is strictly prohibited in production environment."""
    from backend.app.core.config import Settings

    with pytest.raises(ValueError, match="ENABLE_DEV_IDENTITY cannot be true when ENVIRONMENT is 'production'"):
        Settings(ENVIRONMENT="production", ENABLE_DEV_IDENTITY=True)
