import pandas as pd
from typing import List, Dict
from io import BytesIO
from datetime import datetime

def parse_excel(file: BytesIO, kpi_date: datetime) -> Dict[str, List[Dict]]:
    df = pd.read_excel(file, sheet_name=None, header=1)
    performance = []

    if "Performance_Sheet" in df:
        perf_df = df["Performance_Sheet"].fillna(0)
        perf_df.columns = [col.strip() for col in perf_df.columns]
        for _, row in perf_df.iterrows():
            performance.append({
                "user_phone": str(row.get("RETAILER", "")).strip(),
                "date": kpi_date.strftime("%Y-%m-%d"),
                "alt_phone": row.get("Alternate Number",0),
                "role": row.get("Role", 0),
                "llm_mnp": row.get("LLM MNP", 0),
                "llm_jmnp": row.get("LLM M4 Decay", 0),
                "llm_3mnp": row.get("LLM > 3 MNP Days", 0),
                "llm_fwa": row.get("LLM FWA", 0),
                "llm_mdsso": row.get("LLM MDSSO", 0),
                "llm_sim_billing": row.get("LLM Sim Billing Tgt vs Ach", 0),
                "llm_mnp_tgt_act": row.get("LLM MNP Tgt vs Ach", 0),
                "lm_mnp": row.get("LM MNP", 0),
                "lm_jmnp": row.get("LM M4 Decay", 0),
                "lm_3mnp": row.get("LM > 3 MNP Days", 0),
                "lm_fwa": row.get("LM FWA", 0),
                "lm_mdsso": row.get("LM MDSSO", 0),
                "lm_sim_billing": row.get("LM Sim Billing Tgt vs Ach", 0),
                "lm_mnp_tgt_act": row.get("LM MNP Tgt vs Ach", 0),
                "mtd_mnp": row.get("MTD MNP", 0),
                "mtd_jmnp": row.get("MTD M4 Decay", 0),
                "mtd_3mnp": row.get("MTD > 3 MNP Days", 0),
                "mtd_fwa": row.get("MTD FWA", 0),
                "mtd_mdsso": row.get("MTD MDSSO", 0),
                "mtd_sim_billing": row.get("MTD Sim Billing Tgt vs Ach", 0),
                "mtd_mnp_tgt_act": row.get("MTD MNP Tgt vs Ach", 0),
                "incentive_6lm": row.get("Incentive_6LM", 0),
                "incentive_5lm": row.get("Incentive_5LM", 0),
                "incentive_4lm": row.get("Incentive_4LM", 0),
                "incentive_3lm": row.get("Incentive_3LM", 0),
                "incentive_llm": row.get("Incentive_LLM", 0),
                "incentive_lm": row.get("Incentive_LM", 0),
                "rank_5lm": row.get("ZSM Wise Ranking_5LM", 0),
                "rank_4lm": row.get("ZSM Wise Ranking_4LM", 0),
                "rank_3lm": row.get("ZSM Wise Ranking_3LM", 0),
                "rank_llm": row.get("ZSM Wise Ranking_LLM", 0),
                "rank_lm": row.get("ZSM Wise Ranking_LM", 0),
            })

    return {"performance": performance}
