import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode 

load_dotenv()


NEON_URL = os.environ.get("NEON_URL") 
if not NEON_URL:
    raise ValueError("NEON_URL environment variable is not set.")

UNWANTED_PARAMS = ['sslmode', 'channel_binding'] 

parsed_url = urlparse(NEON_URL)
new_scheme = 'postgresql+asyncpg'
query_params = parse_qs(parsed_url.query)
cleaned_query_params = {}

for key, values in query_params.items():
    if key.lower() not in UNWANTED_PARAMS:
        cleaned_query_params[key] = values


new_query = urlencode(cleaned_query_params, doseq=True)


DATABASE_URL = urlunparse(
    (new_scheme, parsed_url.netloc, parsed_url.path, parsed_url.params, new_query, parsed_url.fragment)
)

Base = declarative_base() 

engine = create_async_engine(
    DATABASE_URL, 
    echo=True,
    connect_args={"ssl": True} 
)

AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db():
    """Dependency to get an async SQLAlchemy session."""
    async with AsyncSessionLocal() as session:
        yield session