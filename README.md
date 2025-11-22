<div>
    <h1 align="center"> 2Merkato Scraper</h1>
</div>

<p align="center">A Simple webapp that allow you to scrape data from 2merkato.com</p>

<div align="center">
<object type="image/svg+xml" align="center" data="architecture\project_outline.drawio.svg" width="100" height="100">
    <!-- Fallback image for older browsers -->
    <img src="public\arc.svg" alt="Company Logo">
</object>
</div>




---
## About
<p>

This is a simple Depo app built with FastAPI and Next.js. I followed a typical FastAPI project structure and incorporated key FastAPI concepts such as route isolation and dependency injection. For asynchronous operations, I used aiohttp for HTTP requests, asyncpg to connect to a serverless database (Neon), and hosted a Redis cache for efficient data storage and retrieval.
</p>
<p>
You might experience some delays because the backend goes to sleep when idle to conserve resources.
</p>

  
<div align="center">
<h2></h1><img src="https://telegra.ph/file/c182d98c9d2bc0295bc86.png" width="20"><b>  
Backend Structure<b></h1>
</div>


```


├── Root
│   ├── main.py
|   ├── requirements.txt
│   ├── api
│   │   ├── api_schema
│   │   │   ├── __init__.py
│   │   │   └── schema.py
│   │   ├── cache
|   |   |   |    redis.py
│   │   │   └── __init__.py
│   │   ├── models
│   │   │   ├── __init__.py
|   |   |   |__ init_db.py  (migrations)
│   │   │   ├── database.py
│   │   │   └── init_db.py
│   │   ├── routes
│   │   │   ├── __init__.py
│   │   │   └── comp.py
│   │   ├── tests
|   |   |   |  tests.py (i write a simple test to check the routes in prodution)
│   │   │   └── __init__.py
│   │   └── utils
│   │       ├── __init__.py
│   │       └── scrapper.py   (the web scraper script)              
|___|                            

```
  
-------


```py
    [Backend]
    backend uvicorn main:app --reload 


    [frontend]
    npm run build
    npm run dev
```



## Starters

For Nextjs and Fastapi
https://github.com/digitros/nextjs-fastapi