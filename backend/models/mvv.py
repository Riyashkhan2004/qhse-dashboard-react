from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date

from models.base import Base


class MVV(Base):
    __tablename__ = "mvv"

    id = Column(Integer, primary_key=True, index=True)
    project = Column(String, nullable=False)
    violation_type = Column(String, nullable=False)
    mvv_count = Column(Integer, nullable=False)
    reporting_month = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
