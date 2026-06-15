import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Date, Text, JSON, BINARY

from .base import Base
from utils.helpers import LOCAL_TZ

class QHSEForms(Base):
    __tablename__ = "nmobb"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    rig_name = Column(String, nullable=False)
    
    