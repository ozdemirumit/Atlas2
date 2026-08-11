import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_incidents(client: AsyncClient) -> None:
    response = await client.get("/api/v1/incidents")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["incident_id"] == "INC-2026-0810-01"


@pytest.mark.asyncio
async def test_run_rca_analysis(client: AsyncClient) -> None:
    payload = {
        "incident_id": "INC-2026-0810-01",
        "telemetry_summary": "SAN Fabric A CRC error drops",
    }
    response = await client.post("/api/v1/incidents/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["ai_confidence_score"] >= 0.90
    assert "rag_document_citations" in data
    assert len(data["rag_document_citations"]) >= 1
    assert "source_document" in data["rag_document_citations"][0]


@pytest.mark.asyncio
async def test_submit_c3_approval(client: AsyncClient) -> None:
    payload = {"approver_notes": "Verified RAG citations."}
    response = await client.post("/api/v1/incidents/INC-2026-0810-01/approve-c3", json=payload)
    assert response.status_code == 200
    assert "Approval submitted" in response.json()["message"]
