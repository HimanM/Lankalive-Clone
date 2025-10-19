"""Top-level package for the backend app."""

from .config.db import get_engine

__all__ = ["get_engine"]
