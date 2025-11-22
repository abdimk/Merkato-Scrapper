from typing import List, Dict, Any
from fastapi import FastAPI, APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, select


Base = declarative_base()

class Company(Base):
    __tablename__ = 'companies'
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String)
    url = Column(String, unique=True, index=True)
    
    def __init__(self, **kwargs):
 
        super().__init__(**kwargs)


async def save_search_result_sqlalchemy(db: AsyncSession, scraped_data: List[Dict[str, str]]):
    """
    Simulates the logic to check for existing companies and save new ones.
    """
    new_companies_count = 0
    
    for company_data in scraped_data:
      
        existing_company_stmt = select(Company).where(Company.url == company_data["url"])
        
       
        result = await db.execute(existing_company_stmt) 
        existing_company = result.scalar_one_or_none()
        
        if not existing_company:
           
            new_companies_count += 1

    return {"status": "success", "new_records": new_companies_count}

async def mock_scraper(keyword: str):
    """Simulates the scraping process that returns data."""
    if keyword == "insurances":
        return [
            {"company_name": "Phoenix Xpress Logistics", "url": "https://www.2merkato.com/directory/40278-phoenix-xpress-logistics"},
            {"company_name": "New Insurance Co.", "url": "https://www.2merkato.com/directory/new-insurance"}
        ]
    return []


async def get_db_session_mock():
    """Placeholder for the dependency injector."""
    pass


router = APIRouter()

@router.get("/search/{keyword}")
async def search_companies(keyword: str, db: AsyncSession = Depends(get_db_session_mock)):
    """API endpoint to search for a keyword, scrape, and save results."""
    scraped = await mock_scraper(keyword)
    

    save_result = await save_search_result_sqlalchemy(db, scraped)
    
    return {"keyword": keyword, "total_scraped": len(scraped), "db_result": save_result}

app = FastAPI()
app.include_router(router, prefix="/api")