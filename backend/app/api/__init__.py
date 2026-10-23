"""API Router package for Tech Research AI.

Provides versioned routing endpoints for research jobs, document ingestion,
and system status diagnostics.
"""

from .v1 import api_v1_router

__all__ = ["api_v1_router"]
