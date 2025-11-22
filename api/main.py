import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

"""
This allow you to pervent relative import hell in serverless functions 
just by adding this to the source file it prevents any relative import issues
"""
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from api.routes.comp import router as company_router


origins = [
        "http://localhost:3000",
        
    ]

allow_origin_regex = r"https://.*\.vercel\.app"

app = FastAPI(
    CORSMiddleware,
    allow_origins=origins, 
    allow_origin_regex=allow_origin_regex,
    title="2merkato Scraper API",
    description="A Simple Asynchronous web scraper for 2merkato.com with caching and database storage.",
    version="1.0.0",
    swagger_ui_parameters={"syntaxHighlight": False}
)


app.include_router(company_router, prefix="/api")

@app.get("/")
async def index():
    return {"API":"is Up and running"}



@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"], operation_id="catch_all_fallback")
async def catch_all_routes(request: Request, full_path: str):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": f"The path '/{full_path}' does not exist. Try /api/search/keyword or /api/stats"
        }
)