import logging
import sys
import re
from typing import Any, Dict

# Regex to redact sensitive patterns
SENSITIVE_PATTERNS = [
    re.compile(r'(api[_-]?key|secret|token|password|bearer\s+[a-zA-Z0-9_\-\.]+)', re.IGNORECASE),
    re.compile(r'(Authorization:\s*Bearer\s+[a-zA-Z0-9_\-\.]+)', re.IGNORECASE)
]


class RedactingFormatter(logging.Formatter):
    """Custom logging formatter to sanitize secrets from logs."""
    def format(self, record: logging.LogRecord) -> str:
        original = super().format(record)
        sanitized = original
        for pattern in SENSITIVE_PATTERNS:
            sanitized = pattern.sub(r'\1=***REDACTED***', sanitized)
        return sanitized


def setup_logger(name: str = "bhoomi_verify") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(logging.INFO)
        formatter = RedactingFormatter(
            fmt="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger


logger = setup_logger()


def log_api_event(
    request_id: str,
    operation: str,
    state: str = "UNKNOWN",
    provider_id: str = "NONE",
    case_id: str = "NONE",
    latency_ms: float = 0.0,
    status: str = "SUCCESS",
    error_code: str = "NONE"
):
    """Structured audit and operation logging helper."""
    logger.info(
        f"[AUDIT] request_id={request_id} case_id={case_id} state={state} "
        f"provider={provider_id} op={operation} latency={latency_ms:.2f}ms "
        f"status={status} error={error_code}"
    )
