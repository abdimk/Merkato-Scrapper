import os
import redis
import json
from dotenv import load_dotenv

load_dotenv()

r = redis.Redis(
    host=os.environ.get("REDIS_HOST"),
    port=os.environ.get("REDIS_PORT"),
    decode_responses=True,
    username=os.environ.get("REDIS_USERNAME"),
    password=os.environ.get("REDIS_PASSWORD"),
)

def get_cache(key: str):
    result = r.get(key)
    return json.loads(result) if result else None

def set_cache(key: str, value, expire=18000):
    r.set(key, json.dumps(value), ex=expire)


def increment_total_requests():
    r.incr("total_requests")

def get_total_requests():
    value = r.get("total_requests")
    return int(value) if value else 0

def increment_keyword_search(keyword):
    r.incr(f"search_count:{keyword}")
    r.zincrby("keyword_rankings", 1, keyword)


def get_keyword_count(keyword):
    value = r.get(f"search_count:{keyword}")
    return int(value) if value else 0


def get_top_keywords(limit=10):
    results = r.zrevrange("keyword_rankings", 0, limit-1, withscores=True)
    return [{"keyword": k, "count": int(score)} for k, score in results]
