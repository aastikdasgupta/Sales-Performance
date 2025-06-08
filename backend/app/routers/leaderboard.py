import os
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from collections import defaultdict
from app.auth import get_current_user
from app.database.db import SalesDB
from app.utils.common_methods import ROLE_KPIS, get_last_3_months, MONTH_PREFIXES

router = APIRouter()


@router.get("/leaderboard")
def get_leaderboards(current_user: dict = Depends(get_current_user)):
    phone = current_user["phone"]

    with SalesDB() as db:
        users = db.get_records("users", [("phone", "=", phone)])
        if not users:
            raise HTTPException(status_code=404, detail="User not found")

        user = users[0]
        role = user["role"]

        if role not in ROLE_KPIS:
            raise HTTPException(status_code=403, detail=f"No leaderboard for role: {role}")

        relevant_kpis = ROLE_KPIS[role]
        target_months = get_last_3_months()  # [(year, month)] with current month first

        # Get all performance records for this role
        all_records = db.get_records("performance", [("role", "=", role)])

        # Get latest record per user (max date)
        latest_per_user = {}
        for rec in all_records:
            try:
                uid = int(rec["user_id"])
                dt = datetime.strptime(rec["date"], "%Y-%m-%d")
                if uid not in latest_per_user or datetime.strptime(latest_per_user[uid]["date"], "%Y-%m-%d") < dt:
                    latest_per_user[uid] = rec
            except Exception:
                continue

        leaderboards = {}

        # For each target month, build leaderboard based on prefix
        for idx, (y, m) in enumerate(target_months):
            prefix = MONTH_PREFIXES[idx]

            # Aggregate stats per user based on prefix fields in their latest record
            stats = []
            for uid, rec in latest_per_user.items():
                incentive = rec.get(f"{prefix}_incentive", 0) or 0
                jio_mnp = rec.get("jio_mnp", 0) or 0  # Assuming jio_mnp is not prefixed and relevant for all months

                # Sum relevant KPIs with prefix
                metrics = {kpi: rec.get(f"{prefix}_{kpi}", 0) or 0 for kpi in relevant_kpis}

                stats.append((uid, incentive, jio_mnp, metrics))

            # Sort by incentive desc, then jio_mnp desc
            sorted_stats = sorted(stats, key=lambda x: (-x[1], -x[2]))

            top_5 = []
            for rank, (uid, incentive, jio_mnp, metrics) in enumerate(sorted_stats[:5], 1):
                profile_result = db.get_records("users", [("id", "=", uid)])
                if not profile_result:
                    continue
                profile = profile_result[0]

                photo_relative_path = f"/static/assets/profile/{uid}_profile_icon.png"
                abs_photo_path = os.path.join("app", "static", "assets", "profile", f"{uid}_profile_icon.png")
                if not os.path.isfile(abs_photo_path):
                    photo_relative_path = "/static/assets/profile/default_profile_icon.png"

                top_5.append({
                    "rank": rank,
                    "user_id": uid,
                    "user_name": profile.get("name", "Unknown"),
                    "user_photo": photo_relative_path,
                    "metrics": metrics,
                    "incentive": incentive,
                    "jio_mnp": jio_mnp
                })

            leaderboards[f"{y}-{m:02d}"] = top_5

        return {
            "role": role,
            "leaderboards": leaderboards
        }