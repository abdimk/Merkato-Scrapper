<div>
    <h1 align="center"> Merkato Scrapper</h1>
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
You might exxperance some dealy when beacuse when it loses a request the backend sleeps to conserve resource 
</p>
## 
```py
    

    backend uvicorn main:app --reload 
```



## Starters

For Nextjs and Fastapi
https://github.com/digitros/nextjs-fastapi