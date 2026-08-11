import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_knowledge_documents(client: AsyncClient) -> None:
    response = await client.get("/api/v1/knowledge/documents")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    assert "document_id" in data[0]


@pytest.mark.asyncio
async def test_ingest_knowledge_document(client: AsyncClient) -> None:
    payload = {
        "title": "Brocade FC Zoning Best Practices",
        "category": "SAN Switch",
        "version": "v9.2.0",
        "access_boundary": "Restricted (NOC)",
        "content": "This runbook documents single-initiator single-target FC port zoning procedures.",
    }
    response = await client.post("/api/v1/knowledge/ingest", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["chunks_count"] >= 1
    assert data["status"] == "INDEXED"


@pytest.mark.asyncio
async def test_query_knowledge_rag(client: AsyncClient) -> None:
    payload = {"query": "SAN APD storage condition", "top_k": 2}
    response = await client.post("/api/v1/knowledge/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "retrieved_chunks" in data
    assert len(data["retrieved_chunks"]) <= 2
