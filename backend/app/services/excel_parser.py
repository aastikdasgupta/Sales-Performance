import pandas as pd
from typing import List, Dict
from io import BytesIO
from datetime import datetime

def parse_excel(file: BytesIO, kpi_date: datetime) -> Dict[str, List[Dict]]:
    df = pd.read_excel(file, sheet_name=None)
    performance = []

    if "Performance_Sheet" in df:
        perf_df = df["Performance_Sheet"].fillna(0)
        for _, row in perf_df.iterrows():
            performance.append({
                "user_phone": str(row.get("Mobile Number", "")).strip(),
                "date": kpi_date.strftime("%Y-%m-%d"),
                "alt_phone": row.get("Alternate Number",0),
                "role": row.get("Role", 0),
                "llm_mnp": row.get("LLM MNP", 0),
                "llm_jmnp": row.get("LLM JMNP", 0),
                "llm_fwa": row.get("LLM FWA", 0),
                "llm_mdsso": row.get("LLM MDSSO", 0),
                "llm_sim_billing": row.get("LLM Sim Billing", 0),
                "llm_incentive": row.get("LLM Incentive", 0),
                "lm_mnp": row.get("LM MNP", 0),
                "lm_jmnp": row.get("LM JMNP", 0),
                "lm_fwa": row.get("LM FWA", 0),
                "lm_mdsso": row.get("LM MDSSO", 0),
                "lm_sim_billing": row.get("LM Sim Billing", 0),
                "lm_incentive": row.get("LM Incentive", 0),
                "mtd_mnp": row.get("MTD MNP", 0),
                "mtd_jmnp": row.get("MTD JMNP", 0),
                "mtd_fwa": row.get("MTD FWA", 0),
                "mtd_mdsso": row.get("MTD MDSSO", 0),
                "mtd_sim_billing": row.get("MTD Sim Billing", 0),
                "mtd_incentive": row.get("MTD Incentive", 0),
            })

    return {"performance": performance}
