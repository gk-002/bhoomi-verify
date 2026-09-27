from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings
from app.core.logger import logger

db_url = settings.get_database_url()

# Configure engine with connection pool & SQLite support
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        echo=False
    )
else:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes database tables and seeds demo cases."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema initialized successfully.")
        from app.core.seeder import seed_demo_cases
        with SessionLocal() as db:
            seed_demo_cases(db)
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
