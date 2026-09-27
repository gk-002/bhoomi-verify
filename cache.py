import json
import time
from typing import Optional, Any, Dict
from app.core.config import settings
from app.core.logger import logger


class CacheManager:
    """Provides caching with Redis and graceful in-memory TTL fallback."""
    _memory_cache: Dict[str, Dict[str, Any]] = {}
    _redis_client = None
    _redis_available = False

    @classmethod
    def init_redis(cls):
        try:
            import redis
            cls._redis_client = redis.Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=1
            )
            cls._redis_client.ping()
            cls._redis_available = True
            logger.info("Connected to Redis cache successfully.")
        except Exception:
            cls._redis_available = False
            logger.info("Redis not reachable; using in-memory TTL cache fallback.")

    @classmethod
    def build_cache_key(
        cls,
        state: str,
        district: str,
        tehsil: str,
        village: str,
        identifier: str,
        operation: str,
        provider: str
    ) -> str:
        """Constructs a deterministic cache key omitting sensitive data."""
        clean_key = f"bv:{state.upper()}:{district.lower()}:{tehsil.lower()}:{village.lower()}:{identifier.strip()}:{operation}:{provider}"
        return clean_key

    @classmethod
    def get(cls, key: str) -> Optional[Dict[str, Any]]:
        if not settings.CACHE_ENABLED:
            return None

        # 1. Try Redis
        if cls._redis_available and cls._redis_client:
            try:
                val = cls._redis_client.get(key)
                if val:
                    return json.loads(val)
            except Exception:
                cls._redis_available = False

        # 2. Fallback to memory
        entry = cls._memory_cache.get(key)
        if entry:
            if time.time() < entry["expires_at"]:
                return entry["data"]
            else:
                del cls._memory_cache[key]
        return None

    @classmethod
    def set(cls, key: str, data: Dict[str, Any], ttl_seconds: int = settings.DEFAULT_CACHE_TTL_SECONDS):
        if not settings.CACHE_ENABLED:
            return

        # 1. Try Redis
        if cls._redis_available and cls._redis_client:
            try:
                cls._redis_client.setex(key, ttl_seconds, json.dumps(data))
                return
            except Exception:
                cls._redis_available = False

        # 2. Fallback to memory
        cls._memory_cache[key] = {
            "data": data,
            "expires_at": time.time() + ttl_seconds
        }


# Initialize connection on module load
CacheManager.init_redis()
