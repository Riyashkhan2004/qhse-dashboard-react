import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models.base import Base

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'qhse.db')}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)

def schedule_qhse():
    # Import here to avoid circular import
    from utils.scheduler import scheduler
    # Start the scheduler if not already started
    if not scheduler.running:
        scheduler.start()


    