from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from io import BytesIO
from datetime import datetime
from app.services.excel_parser import parse_excel
from app.database.db import SalesDB
from app.auth import get_current_user

router = APIRouter()

@router.post("/upload-excel")
async def upload_excel(
    file: UploadFile = File(...),
    date: str = Form(...),
    role: str = Form(...),
    current_user: dict = Depends(get_current_user)
):

    print(role)

    if current_user["role"].lower() != "admin":
        raise HTTPException(status_code=403, detail="Only Admin can upload Excel data.")

    try:
        kpi_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    contents = await file.read()

    try:
        parsed = parse_excel(BytesIO(contents), kpi_date, role)
        print(parsed)

        data_key = {
            "asc": "performance",
            "distributor": "performance_dtr",
            "promoter": "performance_ptr"
        }.get(role.lower())

        performance_table = data_key
        print(performance_table)

        if not data_key or data_key not in parsed:
            raise HTTPException(status_code=400, detail="Invalid role or no data found.")

        with SalesDB() as db:
            print(parsed[data_key])
            for perf in parsed[data_key]:
                user_phone = perf.pop("user_phone", None)
                if not user_phone:
                    continue

                user_records = db.get_records("users", [("phone", "=", user_phone)])
                if not user_records:
                    continue

                perf["user_id"] = user_records[0]["id"]
                db.add_record(performance_table, perf)
                print(perf)

        return {
            "message": f"Excel data uploaded successfully."
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing Excel: {e}")
