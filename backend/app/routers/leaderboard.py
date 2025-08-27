import os
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.auth import get_current_user
from app.database.db import SalesDB
from app.utils.common_methods import ROLE_KPIS, get_suffix_months

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
        zsm = user["zsm"]

        if role not in ROLE_KPIS:
            raise HTTPException(status_code=403, detail=f"No leaderboard for role: {role}")

        relevant_kpis = ROLE_KPIS[role]

        # 🎯 Get all user_ids with same role and same zsm
        peer_users = db.get_records("users", [("role", "=", role), ("zsm", "=", zsm)])
        peer_user_ids = set(u["id"] for u in peer_users)

        # 📦 Get all performance records
        all_perf_records = db.get_records("performance", [])
        # Filter records only for peer users
        relevant_records = [rec for rec in all_perf_records if int(rec["user_id"]) in peer_user_ids]

        # 🗂️ Get latest record per user
        latest_per_user = {}
        for rec in relevant_records:
            try:
                uid = int(rec["user_id"])
                dt = datetime.strptime(rec["date"], "%Y-%m-%d")
                if uid not in latest_per_user or datetime.strptime(latest_per_user[uid]["date"], "%Y-%m-%d") < dt:
                    latest_per_user[uid] = rec
            except Exception:
                continue

        # 🧩 Work with the last 3 suffixes from get_suffix_months
        suffix_months = get_suffix_months()
        leaderboards = {}

        for suffix, (_, _), month_name in reversed(suffix_months):  # reverse to show newest first
            rank_field = f"rank_{suffix}"
            metric_prefix = suffix

            # Check if all peer users have rank = "-" or None
            all_blank = True
            for uid in peer_user_ids:
                user_rec = latest_per_user.get(uid)
                if not user_rec:
                    continue
                rank = user_rec.get(rank_field)
                if rank and rank != "-":
                    all_blank = False
                    break

            if all_blank:
                leaderboards[month_name] = []  
                continue

            # Build leaderboard entries with valid ranks only
            valid_stats = []
            for uid in peer_user_ids:
                rec = latest_per_user.get(uid)
                if not rec:
                    continue
                raw_rank = rec.get(rank_field)
                if not raw_rank or raw_rank == "-":
                    continue
                try:
                    rank_num = int(str(raw_rank).split("/")[0])
                except:
                    continue

                metrics = {
                    kpi: rec.get(f"{metric_prefix}_{kpi}", 0) or 0
                    for kpi in relevant_kpis
                }

                profile_result = db.get_records("users", [("id", "=", uid)])
                if not profile_result:
                    continue
                profile = profile_result[0]

                photo_relative_path = f"/static/assets/profile/{uid}_profile_icon.png"
                abs_photo_path = os.path.join("app", "static", "assets", "profile", f"{uid}_profile_icon.png")
                if not os.path.isfile(abs_photo_path):
                    photo_relative_path = "/static/assets/profile/default_profile_icon.png"

                valid_stats.append({
                    "rank_value": rank_num,
                    "user_id": uid,
                    "user_name": profile.get("name", "Unknown"),
                    "user_photo": photo_relative_path,
                    "metrics": metrics,
                    "raw_rank": raw_rank
                })

            # Sort by rank and select top 5
            sorted_top_5 = sorted(valid_stats, key=lambda x: x["rank_value"])[:5]

            # Clean up rank_value before returning
            for i, entry in enumerate(sorted_top_5, 1):
                entry["rank"] = i
                del entry["rank_value"]

            leaderboards[month_name] = sorted_top_5

        if not leaderboards:
            return { "leaderboards": "Leaderboard not yet available!" }

        return {
            "role": role,
            "zsm": zsm,
            "leaderboards": leaderboards
        }