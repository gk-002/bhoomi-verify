import time
from enum import Enum
from typing import Dict


class CircuitState(str, Enum):
    CLOSED = "CLOSED"      # Normal operation
    OPEN = "OPEN"          # Failing, fast fail
    HALF_OPEN = "HALF_OPEN"  # Testing if recovered


class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout_seconds: float = 30.0,
        success_threshold: int = 2
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout_seconds = recovery_timeout_seconds
        self.success_threshold = success_threshold

        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_state_change = time.time()

    def can_execute(self) -> bool:
        """Determines if a call can proceed through the circuit."""
        now = time.time()
        if self.state == CircuitState.CLOSED:
            return True
        elif self.state == CircuitState.OPEN:
            if now - self.last_state_change >= self.recovery_timeout_seconds:
                self.state = CircuitState.HALF_OPEN
                self.last_state_change = now
                return True
            return False
        elif self.state == CircuitState.HALF_OPEN:
            return True
        return False

    def record_success(self):
        """Records a successful request."""
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.success_threshold:
                self.state = CircuitState.CLOSED
                self.failure_count = 0
                self.success_count = 0
                self.last_state_change = time.time()
        else:
            self.failure_count = 0

    def record_failure(self):
        """Records a failed request."""
        self.failure_count += 1
        if self.state in (CircuitState.CLOSED, CircuitState.HALF_OPEN):
            if self.failure_count >= self.failure_threshold or self.state == CircuitState.HALF_OPEN:
                self.state = CircuitState.OPEN
                self.last_state_change = time.time()
                self.success_count = 0


class CircuitBreakerRegistry:
    _breakers: Dict[str, CircuitBreaker] = {}

    @classmethod
    def get_breaker(cls, provider_id: str) -> CircuitBreaker:
        if provider_id not in cls._breakers:
            cls._breakers[provider_id] = CircuitBreaker()
        return cls._breakers[provider_id]
