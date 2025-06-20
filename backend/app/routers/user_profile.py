import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional
from app.auth import get_current_user
from app.database.db import SalesDB

router = APIRouter()

# Directory to save profile photos
PROFILE_DIR = os.path.join("app", "static", "assets", "profile")
os.makedirs(PROFILE_DIR, exist_ok=True)

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
            "alt_phone": user.get("alt_phone"),
            "photo": user.get("photo")
        }

@router.put("/photo")
async def update_profile_photo(
    current_user: dict = Depends(get_current_user),
    photo: UploadFile = File(...)
):
    phone = current_user["phone"]
    user_id = current_user["id"]
    
    filename = f"{user_id}_profile_icon.png"
    filepath = os.path.join(PROFILE_DIR, filename)

    try:
        with open(filepath, "wb") as f:
            f.write(await photo.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save photo: {e}")

    photo_path = f"/static/assets/profile/{filename}"

    with SalesDB() as db:
        success = db.update_record("users", [("phone", "=", phone)], {"photo": photo_path})
        if not success:
            raise HTTPException(status_code=404, detail="User not found for photo update.")

    return {"message": "Photo updated successfully", "photo": photo_path}

@router.put("/alt-phone")
async def update_alt_phone(
    alt_phone: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    phone = current_user["phone"]

    with SalesDB() as db:
        success = db.update_record("users", [("phone", "=", phone)], {"alt_phone": alt_phone})
        if not success:
            raise HTTPException(status_code=404, detail="User not found for alt_phone update.")

    return {"message": "Alternate phone number updated", "alt_phone": alt_phone}