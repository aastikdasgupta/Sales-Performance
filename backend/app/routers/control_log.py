from fastapi import APIRouter, HTTPException, Query, Depends, Form
from typing import List
from datetime import datetime
from app.database.db import SalesDB
from app.auth import get_current_user  # assuming token-based auth

router = APIRouter()

@router.post("/log")
def get_control_logs_by_date(
    date: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"].lower() != "admin":
        raise HTTPException(status_code=403, detail="Only Admin can view control logs.")

    try:
        # Validate the date format
        parsed_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    try:
        with SalesDB() as db:
            logs = db.get_records(
                table_name="control_log",
                match_vals=[("DATE(login_time)", "=", date)]
            )

        return logs

    except Exception as e:
        import traceback
        traceback.print_exc()  # Show full traceback
        raise HTTPException(status_code=500, detail=str(e))

