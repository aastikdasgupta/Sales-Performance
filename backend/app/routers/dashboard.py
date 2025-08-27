from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.auth import get_current_user
from app.database.db import SalesDB
from app.utils.common_methods import ROLE_KPIS, MONTH_MAP, get_last_3_months, get_suffix_months, MONTH_PREFIXES
import os

router = APIRouter()

def replace_dash_with_na(data):
    if isinstance(data, dict):
        return {k: replace_dash_with_na(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [replace_dash_with_na(i) for i in data]
    elif data == "-":
        return "NA"
    return data
    
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
        print(role)

        if role not in ROLE_KPIS:
            raise HTTPException(status_code=403, detail=f"No dashboard for role: {role}")

        kpis = ROLE_KPIS[role]
        months = get_last_3_months()
        month_labels = [MONTH_MAP[m] for (_, m) in months]

        performance_table = "performance_dtr" if role == "Distributor" else "performance"
        print(performance_table)

        all_data = db.get_records(performance_table, [("user_id", "=", user_id), ("role", "=", role)])

        if not all_data:
            response = {
                "user_id": user_id,
                "role": role,
                "kpis": kpis,
                "performance": [
                    { "month": label, **{k: 0 for k in kpis}}
                    for label in month_labels
                ],
                "hygiene": [],
                "incentive_performance": [],
                "zone": user.get("zone"),
                "distributor": user.get("dtr"),
                "tsm": user.get("tsm"),
                "zsm": user.get("zsm"),
                "incentive_scheme": None
            }
            return replace_dash_with_na(response)

        latest_record = max(
            all_data,
            key=lambda r: datetime.strptime(r["date"], "%Y-%m-%d")
        )
        latest_date = datetime.strptime(latest_record["date"], "%Y-%m-%d")
        latest_data_date_str = latest_date.strftime('%d-%b-%Y')

        # PERFORMANCE DATA
        performance = []
        for idx, prefix in enumerate(MONTH_PREFIXES):
            month_label = month_labels[idx]
            kpi_values = {k: latest_record.get(f"{prefix}_{k}", 0) or 0 for k in kpis}

            # Fix numeric values (optional)
            if "mdsso" in kpi_values:
                kpi_values["mdsso"] = round(float(kpi_values["mdsso"]), 2)
            if "jmnp" in kpi_values:
                kpi_values["jmnp"] = round(float(kpi_values["jmnp"]), 2)

            performance.append({
                "month": month_label,
                **kpi_values
            })

        hygiene = []
        if role.lower() == "distributor":
            print("entered!")
            hygiene_keys = ["asc_norms", "gt_sso", "dsso", "mdsso", "sim_billing", "jmnp_auto", "tgt_act_4g"]
            for idx, prefix in enumerate(MONTH_PREFIXES):
                month_label = month_labels[idx]
                dict_comp = {k: latest_record.get(f"{prefix}_{k}", "-") for k in hygiene_keys}
                print(f"{prefix} -> {dict_comp}")  # <-- print intermediate dictionary
                hygiene_row = {
                    "month": month_label,
                    **dict_comp
                }
                hygiene.append(hygiene_row)
                print(hygiene_row)


        # INCENTIVE + RANKING
        incentive_performance = []
        suffix_months = get_suffix_months()
        print(suffix_months)
        for suffix, (_, _), month_name in reversed(suffix_months):
            if role.lower() == "distributor":
                tdp = latest_record.get(f"tdp_earned_{suffix}", 0)
                pli = latest_record.get(f"pli_slab_{suffix}", "-")
                total = latest_record.get(f"total_earning_{suffix}", 0)
                rank = latest_record.get(f"rank_{suffix}", None)
                incentive_performance.append({
                    "month": month_name,
                    "tdp_earned": tdp,
                    "pli_slab": pli,
                    "total_earning": total,
                    "rank": rank
                })
            else:
                incentive = latest_record.get(f"incentive_{suffix}", 0) or 0
                rank = latest_record.get(f"rank_{suffix}", None)
                incentive_performance.append({
                    "month": month_name,
                    "incentive": incentive,
                    "rank": rank
                })

        # INCENTIVE SCHEME IMAGE
        latest_year, latest_month = months[-1]
        filename = f"incentives_{role.lower()}_{latest_month:02d}_{latest_year}.jpg"
        filepath = f"app/static/assets/incentive/{filename}"
        incentive_scheme_url = filepath if os.path.exists(filepath) else None

        response = {
            "user_id": user_id,
            "role": role,
            "kpis": kpis,
            "performance": performance,
            "incentive_performance": incentive_performance,
            "zone": user.get("zone"),
            "distributor": user.get("dtr"),
            "tsm": user.get("tsm"),
            "zsm": user.get("zsm"),
            "incentive_scheme": incentive_scheme_url,
            "message": f"**UPDATED DASHBOARD IS NOW LIVE!! Data refreshed as of {latest_data_date_str}.",

        }

        # Only add hygiene for distributor
        if role == "Distributor":
            response["hygiene"] = hygiene

        return replace_dash_with_na(response)