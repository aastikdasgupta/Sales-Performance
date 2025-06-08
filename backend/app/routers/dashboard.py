from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.auth import get_current_user
from app.database.db import SalesDB
from app.utils.common_methods import ROLE_KPIS, MONTH_MAP, get_last_3_months, MONTH_PREFIXES

router = APIRouter()


@router.get("/dashboard")
def get_dashboard(current_user: dict = Depends(get_current_user)):
    phone = current_user["phone"]

    with SalesDB() as db:
        users = db.get_records("users", [("phone", "=", phone)])
        if not users:
            raise HTTPException(status_code=404, detail="User not found")

        user = users[0]
        user_id = user["id"]
        role = user["role"]

        if role not in ROLE_KPIS:
            raise HTTPException(status_code=403, detail=f"No dashboard for role: {role}")

        kpis = ROLE_KPIS[role]
        months = get_last_3_months()  # [(year, month), ...]
        month_labels = [MONTH_MAP[m] for (_, m) in months]

        # Fetch all performance records for this user & role
        all_data = db.get_records("performance", [("user_id", "=", user_id), ("role", "=", role)])

        if not all_data:
            # No data for user
            return {
                "user_id": user_id,
                "role": role,
                "kpis": kpis,
                "performance": [
                    { "month": label, **{k:0 for k in kpis}, "rank": None }
                    for label in month_labels
                ]
            }

        # Find the latest record by date for this user
        latest_record = max(
            all_data,
            key=lambda r: datetime.strptime(r["date"], "%Y-%m-%d")
        )

        # Now build rank for each month (prefix) based on all users' incentives for that month
        # So fetch all users' latest records for the role (same as your previous approach but only latest per user)
        all_role_data = db.get_records("performance", [("role", "=", role)])

        # Build latest record per user (max date)
        latest_per_user = {}
        for rec in all_role_data:
            try:
                uid = int(rec["user_id"])
                date_obj = datetime.strptime(rec["date"], "%Y-%m-%d")
                if uid not in latest_per_user or datetime.strptime(latest_per_user[uid]["date"], "%Y-%m-%d") < date_obj:
                    latest_per_user[uid] = rec
            except Exception:
                continue

        # Compute rankings per month prefix
        rankings = []
        for prefix in MONTH_PREFIXES:
            user_incentives = []
            for uid, rec in latest_per_user.items():
                inc = rec.get(f"{prefix}_incentive", 0) or 0
                user_incentives.append((uid, inc))
            # Sort descending by incentive
            sorted_users = sorted(user_incentives, key=lambda x: -x[1])
            user_ranks = {uid: rank + 1 for rank, (uid, _) in enumerate(sorted_users)}
            rankings.append(user_ranks.get(user_id))

        # Build response using latest_record for all three months by prefix
        performance = []
        for idx, prefix in enumerate(MONTH_PREFIXES):
            month_label = month_labels[idx]
            kpi_values = {k: latest_record.get(f"{prefix}_{k}", 0) or 0 for k in kpis}
            performance.append({
                "month": month_label,
                **kpi_values,
                "rank": rankings[idx]
            })

        return {
            "user_id": user_id,
            "role": role,
            "kpis": kpis,
            "performance": performance
        }
