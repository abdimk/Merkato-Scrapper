from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import sys
from pathlib import Path


project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from utils.scrapper import main_scraper 

from models.database import get_db
from models.models import Company
from ..api_schema.schema import CompanyResponse,SearchSchema,SearchResponse
from api.cache.redis import (
    get_cache, set_cache, 
    get_total_requests, 
    get_top_keywords, 
    increment_keyword_search, 
    increment_total_requests
)
from sqlalchemy import select

router = APIRouter(tags=["Companies"])

async def save_search_result_sqlalchemy(db: AsyncSession, scraped_data: List[dict]):
    """Saves scraped data to the database (only new records)."""
    for item in scraped_data:
       
        existing_company_stmt = select(Company).where(Company.url == item.get('url'))
        existing_company = (await db.execute(existing_company_stmt)).scalar_one_or_none()
        
        if existing_company:
            continue
        

        new_company = Company(
            company_name=item.get('company_name'),
            url=item.get('url'),
            email=item.get('email'),
            website=item.get('website'),
            location=item.get('location'),
            logo_url=item.get('logo_url'),
            phone_main=item.get('phone_main'),
            description_full=item.get('description_full'),
            primary_category=item.get('primary_category'),
            products_and_services=item.get('products_and_services')
        )
        db.add(new_company)
    
    await db.commit()

@router.post("/search", response_model=SearchResponse)
async def search(search: SearchSchema, db: AsyncSession = Depends(get_db)):
    keyword = search.term.lower().strip()
    limit = search.response_limit
    print(limit)

    increment_total_requests()
    increment_keyword_search(keyword)

    cached = get_cache(keyword)
    if cached:
        return SearchResponse(
            source="cache",
            results=[CompanyResponse.model_validate(r) for r in cached][:limit]
        )

    scraped = await main_scraper(keyword, max_pages_limit=3)
    set_cache(keyword, scraped)

    await save_search_result_sqlalchemy(db, scraped)

    return SearchResponse(
        source="database",
        results=[CompanyResponse.model_validate(r) for r in scraped][:limit]
    )



@router.get("/stats")
async def stats():
    return {
        "total_requests": get_total_requests(),
        "top_keywords": get_top_keywords(10)
    }