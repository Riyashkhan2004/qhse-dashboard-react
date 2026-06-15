from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.mvv_schema import MVVCreate, MVVResponse, ProjectTotalResponse, MVVByMonthProjectResponse
from services.mvv_service import (
    create_mvv,
    get_all_mvv,
    get_mvv_by_id,
    update_mvv,
    delete_mvv,
    get_project_totals,
    get_mvv_by_project,
    get_mvv_by_month_project
)

router = APIRouter()


@router.post("", response_model=MVVResponse, status_code=status.HTTP_201_CREATED)
def create_mvv_endpoint(mvv: MVVCreate, db: Session = Depends(get_db)) -> MVVResponse:
    """
    Create a new MVV record.
    """
    try:
        db_mvv = create_mvv(db, mvv)
        return db_mvv
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("", response_model=List[MVVResponse])
def get_all_mvv_endpoint(db: Session = Depends(get_db)) -> List[MVVResponse]:
    """
    Get all MVV records.
    """
    mvv_records = get_all_mvv(db)
    return mvv_records


@router.get("/totals", response_model=List[ProjectTotalResponse])
def get_project_totals_endpoint(
    year: Optional[int] = Query(None, description="Filter by year"),
    db: Session = Depends(get_db)
) -> List[ProjectTotalResponse]:
    """
    Get total MVV count for each project.
    Optionally filter by year.
    """
    try:
        totals = get_project_totals(db, year)
        return totals
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/by-project", response_model=List[ProjectTotalResponse])
def get_mvv_by_project_endpoint(
    year: Optional[int] = Query(None, description="Filter by year"),
    db: Session = Depends(get_db)
) -> List[ProjectTotalResponse]:
    """
    Get MVV violations by project.
    Optionally filter by year.
    """
    try:
        results = get_mvv_by_project(db, year)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/by-month-project", response_model=List[MVVByMonthProjectResponse])
def get_mvv_by_month_project_endpoint(
    year: Optional[int] = Query(None, description="Filter by year"),
    db: Session = Depends(get_db)
) -> List[MVVByMonthProjectResponse]:
    """
    Get MVV data by month and project.
    Optionally filter by year.
    """
    try:
        results = get_mvv_by_month_project(db, year)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{mvv_id}", response_model=MVVResponse)
def get_mvv_by_id_endpoint(mvv_id: int, db: Session = Depends(get_db)) -> MVVResponse:
    """
    Get an MVV record by ID.
    """
    mvv = get_mvv_by_id(db, mvv_id)
    if mvv is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MVV record with id {mvv_id} not found"
        )
    return mvv


@router.put("/{mvv_id}", response_model=MVVResponse)
def update_mvv_endpoint(mvv_id: int, mvv: MVVCreate, db: Session = Depends(get_db)) -> MVVResponse:
    """
    Update an existing MVV record.
    """
    try:
        db_mvv = update_mvv(db, mvv_id, mvv)
        if db_mvv is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"MVV record with id {mvv_id} not found"
            )
        return db_mvv
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{mvv_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_mvv_endpoint(mvv_id: int, db: Session = Depends(get_db)) -> None:
    """
    Delete an MVV record by ID.
    """
    try:
        deleted = delete_mvv(db, mvv_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"MVV record with id {mvv_id} not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
