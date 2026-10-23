import pytest
from app.database.session import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Ensure all database tables are created before running tests."""
    init_db()
    yield
