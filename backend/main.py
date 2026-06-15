import uvicorn
from fastapi import FastAPI
from fastapi.logger import logger
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from utils.scheduler import scheduler
from database import connection
from api.qhse_routes import qhse_router
from api.mvv import router as mvv_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting QHSE Application...")
    connection.init_db()
    # Import scheduler here to avoid circular imports
    from utils.scheduler import scheduler
    if not scheduler.running:
        scheduler.start()
    yield
    logger.info("Shutting Down QHSE Application...")
    scheduler.shutdown()
    
app = FastAPI(
    title="QHSE API",
    description="QHSE Backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(qhse_router, prefix="/api/v1/qhse", tags=["QHSE"])
app.include_router(mvv_router, prefix="/mvv", tags=["MVV"])
# app.include_router(dashboard.dashboard_router, prefix="/api/v1/dashboard", tags=["Dashboard"])

@app.get("/health")
async def root():
    return {"status": "QHSE is Running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000)
