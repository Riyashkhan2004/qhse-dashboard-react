from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import List


class MVVCreate(BaseModel):
    project: str
    violation_type: str
    mvv_count: int = Field(..., ge=0)
    reporting_month: date


class MVVResponse(BaseModel):
    id: int
    project: str
    violation_type: str
    mvv_count: int
    reporting_month: date
    created_at: datetime

    class Config:
        orm_mode = True


class ProjectTotalResponse(BaseModel):
    project: str
    total_count: int

    class Config:
        orm_mode = True


class MVVByMonthProjectResponse(BaseModel):
    month: str
    project: str
    total_count: int

    class Config:
        orm_mode = True
