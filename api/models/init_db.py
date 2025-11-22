
"""
A simple init_db file for neon like similar to migrations in django

"""

import asyncio
import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent
sys.path.append(str(project_root))

from  database import engine, Base
from models import Company 

async def init_db():
    print("Starting database initialization...")
    
   
    async with engine.begin() as conn:
      
        await conn.run_sync(Base.metadata.create_all)
        
    print("Database initialization complete: 'companies' table created (if it didn't exist).")

if __name__ == "__main__":
    
    asyncio.run(init_db())