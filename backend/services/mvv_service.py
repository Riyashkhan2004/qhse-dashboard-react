from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func, extract

from models.mvv import MVV
from schemas.mvv_schema import MVVCreate, ProjectTotalResponse, MVVByMonthProjectResponse


def create_mvv(db: Session, mvv: MVVCreate) -> Optional[MVV]:
    """
    Create a new MVV record.
    """
    try:
        db_mvv = MVV(
            project=mvv.project,
            violation_type=mvv.violation_type,
            mvv_count=mvv.mvv_count,
            reporting_month=mvv.reporting_month
        )
        db.add(db_mvv)
        db.commit()
        db.refresh(db_mvv)
        return db_mvv
    except SQLAlchemyError as e:
        db.rollback()
        raise e


def get_all_mvv(db: Session) -> List[MVV]:
    """
    Get all MVV records.
    """
    return db.query(MVV).all()


def get_mvv_by_id(db: Session, id: int) -> Optional[MVV]:
    """
    Get an MVV record by ID.
    Returns None if not found.
    """
    return db.query(MVV).filter(MVV.id == id).first()


def update_mvv(db: Session, id: int, mvv: MVVCreate) -> Optional[MVV]:
    """
    Update an existing MVV record.
    Returns None if not found.
    """
    try:
        db_mvv = db.query(MVV).filter(MVV.id == id).first()
        if db_mvv is None:
            return None
        
        db_mvv.project = mvv.project
        db_mvv.violation_type = mvv.violation_type
        db_mvv.mvv_count = mvv.mvv_count
        db_mvv.reporting_month = mvv.reporting_month
        
        db.commit()
        db.refresh(db_mvv)
        return db_mvv
    except SQLAlchemyError as e:
        db.rollback()
        raise e


def delete_mvv(db: Session, id: int) -> bool:
    """
    Delete an MVV record by ID.
    Returns True if deleted, False if not found.
    """
    try:
        db_mvv = db.query(MVV).filter(MVV.id == id).first()
        if db_mvv is None:
            return False
        
        db.delete(db_mvv)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        raise e


def get_project_totals(db: Session, year: Optional[int] = None) -> List[ProjectTotalResponse]:
    """
    Get total MVV count grouped by project.
    Optionally filter by year.
    """
    try:
        query = db.query(
            MVV.project,
            func.sum(MVV.mvv_count).label('total_count')
        )
        
        if year:
            query = query.filter(extract('year', MVV.reporting_month) == year)
        
        results = query.group_by(MVV.project).all()
        
        return [ProjectTotalResponse(project=row.project, total_count=int(row.total_count)) for row in results]
    except SQLAlchemyError as e:
        db.rollback()
        raise e


def get_mvv_by_project(db: Session, year: Optional[int] = None) -> List[ProjectTotalResponse]:
    """
    Get MVV violations by project.
    Optionally filter by year.
    """
    return get_project_totals(db, year)


def get_mvv_by_month_project(db: Session, year: Optional[int] = None) -> List[MVVByMonthProjectResponse]:
    """
    Get MVV data grouped by month and project.
    Optionally filter by year.
    """
    try:
        query = db.query(
            func.extract('month', MVV.reporting_month).label('month'),
            MVV.project,
            func.sum(MVV.mvv_count).label('total_count')
        )
        
        if year:
            query = query.filter(extract('year', MVV.reporting_month) == year)
        
        results = query.group_by(
            func.extract('month', MVV.reporting_month),
            MVV.project
        ).order_by(
            func.extract('month', MVV.reporting_month),
            MVV.project
        ).all()
        
        return [
            MVVByMonthProjectResponse(
                month=str(int(row.month)),
                project=row.project,
                total_count=int(row.total_count)
            )
            for row in results
        ]
    except SQLAlchemyError as e:
        db.rollback()
        raise e
