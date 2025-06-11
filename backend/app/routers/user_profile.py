import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Form
from fastapi.responses import JSONResponse
from typing import Optional
from app.auth import get_current_user
from app.database.db import SalesDB

router = APIRouter()

@router.get("/show")
async def get_profile(current_user: dict = Depends(get_current_user)):
    phone = current_user["phone"]

    with SalesDB() as db:
        profile = db.get_records("users", [("phone", "=", phone)])
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found.")
        
        user = profile[0]
        return {
            "name": user.get("name"),
            "phone": user.get("phone"),
            "alt_phone": user.get("alt_phone"),  # Make sure this column exists
            "photo": user.get("photo")
        }