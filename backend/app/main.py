from fastapi import APIRouter, FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.auth import get_current_user
from app.routers import profile
from app.database.db import SalesDB
from app.routers import upload_excel
from app.routers import upload_incentive
from app.auth import router as auth_router
from app.routers import dashboard
from app.routers import leaderboard
from app.routers import user_profile
from app.routers import control_log
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(debug=True)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://13.233.120.130:4200","www.sales-performance.in", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with SalesDB() as sales_db:
    pass

# Include all routers
app.include_router(auth_router)
app.include_router(profile.router)
app.include_router(user_profile.router)
app.include_router(upload_excel.router)
app.include_router(upload_incentive.router)
app.include_router(dashboard.router)
app.include_router(leaderboard.router)
app.include_router(control_log.router)
app.mount("/static", StaticFiles(directory=os.path.join("app", "static")), name="static")