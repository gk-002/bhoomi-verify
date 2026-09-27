import asyncio
import random
import functools
from typing import Callable, Any
from app.core.logger import logger


async def execute_with_retry(
    coroutine_func: Callable[[], Any],
    max_retries: int = 3,
    base_delay: float = 0.5,
    backoff_factor: float = 1.5,
    jitter: bool = True
) -> Any:
    """Executes an async callable with exponential backoff and random jitter."""
    last_exception = None
    delay = base_delay

    for attempt in range(1, max_retries + 1):
        try:
            return await coroutine_func()
        except Exception as e:
            last_exception = e
            if attempt == max_retries:
                logger.warning(f"Retry limit ({max_retries}) reached. Error: {str(e)}")
                raise e

            sleep_time = delay
            if jitter:
                sleep_time += random.uniform(0.05, 0.2)

            logger.info(f"Attempt {attempt} failed ({str(e)}). Retrying in {sleep_time:.2f}s...")
            await asyncio.sleep(sleep_time)
            delay *= backoff_factor

    if last_exception:
        raise last_exception
