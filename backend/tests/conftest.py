from collections.abc import AsyncIterator

import pytest
from httpx import ASGITransport, AsyncClient

from backend.app.main import app


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    """Async test client for FastAPI backend."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as ac:
        yield ac
