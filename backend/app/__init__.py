"""app package marker for the backend application."""

# Expose create_app for `python -m app.app` or imports
from .app import create_app  # noqa: F401
"""Top-level package for the backend app."""

from .config.db import get_engine

__all__ = ["get_engine"]
