import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_connectors(client: AsyncClient) -> None:
    response = await client.get("/api/v1/connectors")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    assert any(c["connector_type"] == "Hitachi Ops Center" for c in data)
    assert any(c["connector_type"] == "Brocade SANnav" for c in data)


@pytest.mark.asyncio
async def test_register_and_deregister_connector(client: AsyncClient) -> None:
    # 1. Register a new asset (e.g. ESXi Server)
    payload = {
        "name": "ESX-HOST-101",
        "connector_type": "VMware ESXi / vCenter",
        "host_fqdn": "192.168.10.101",
        "port": 443,
        "auth_credential": "secret_token",
    }
    register_res = await client.post("/api/v1/connectors/register", json=payload)
    assert register_res.status_code == 201
    new_asset = register_res.json()
    assert new_asset["name"] == "ESX-HOST-101"
    connector_id = new_asset["connector_id"]

    # 2. Test connectivity
    test_res = await client.post(f"/api/v1/connectors/{connector_id}/test")
    assert test_res.status_code == 200
    assert test_res.json()["connectivity"] == "CONNECTED"

    # 3. Deregister / Delete the asset
    del_res = await client.delete(f"/api/v1/connectors/{connector_id}")
    assert del_res.status_code == 200
    assert "successfully deregistered" in del_res.json()["message"]
