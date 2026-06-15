from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form

from database.connection import get_db

qhse_router = APIRouter()


