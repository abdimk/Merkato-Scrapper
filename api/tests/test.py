import pytest
import httpx



@pytest.mark.asyncio
async def test_stats_endpoint_status_code_async():
    url = "https://merkato-scrapper.onrender.com/api/stats"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"



@pytest.mark.asyncio
async def test_search_endpoint_status_code_async():
    url = "https://merkato-scrapper.onrender.com/api/search"
    payload = {
        "term": "banks",
        "response_limit": 5
    }
    headers = {"Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
Run: