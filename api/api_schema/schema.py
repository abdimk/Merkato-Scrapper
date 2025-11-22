from typing import List, Optional
from pydantic import BaseModel, HttpUrl, Field




class SearchSchema(BaseModel):
    term:str
    response_limit: Optional[int] = 5


class CompanyResponse(BaseModel):
    company_name: str
    url: Optional[HttpUrl] = None
    email: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[HttpUrl] = None 
    phone_main: Optional[str] = None
    description_full: Optional[str] = None
    primary_category: Optional[str] = None
    products_and_services: Optional[List[str]] = Field(default_factory=list) 

    class Config:
        from_attributes = True

class SearchResponse(BaseModel):
    source: str
    results: List[CompanyResponse]
