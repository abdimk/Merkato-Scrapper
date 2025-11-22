import sys
from pathlib import Path
from sqlalchemy import Column, Integer, String, Text, JSON

project_root = Path(__file__).resolve().parent
sys.path.append(str(project_root))

from models.database import Base 


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    url = Column(String(500), nullable=True)
    email = Column(String(255), nullable=True)
    website = Column(String(500), nullable=True)
    location = Column(String(500), nullable=True)
    logo_url = Column(String(500), nullable=True)
    phone_main = Column(String(50), nullable=True)
    description_full = Column(Text, nullable=True)
    primary_category = Column(String(255), nullable=True)
    products_and_services = Column(JSON, nullable=True)

