import pandas as pd
from typing import List, Dict
from io import BytesIO
from datetime import datetime

def parse_excel(file: BytesIO, kpi_date: datetime, role: str) -> Dict[str, List[Dict]]:
    df = pd.read_excel(file, sheet_name=None, header=1)
    performance = []
    performance_dtr = []

    if "Performance_Sheet" in df:
        perf_df = df["Performance_Sheet"].fillna(0)
        perf_df.columns = [col.strip() for col in perf_df.columns]

        for _, row in perf_df.iterrows():
            if role.lower() == "asc":
                performance.append({
                    "user_phone": str(row.get("RETAILER", "")).strip(),
                    "date": kpi_date.strftime("%Y-%m-%d"),
                    "alt_phone": row.get("Alternate Number", 0),
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
            elif role.lower() == "distributor":
                performance_dtr.append({
                    "user_phone": str(row.get("DTR MSISDN", "")).strip(),
                    "date": kpi_date.strftime("%Y-%m-%d"),
                    "alt_phone": row.get("Alternate Number", 0),
                    "role": row.get("Role", 0),
                    
                    "llm_gross": row.get("LLM Gross", 0),
                    "llm_mnp": row.get("LLM MNP", 0),
                    "llm_trade_gross": row.get("LLM Trade Gross", 0),
                    "llm_trade_mnp": row.get("LLM Trade MNP", 0),
                    "llm_stock": row.get("LLM Stock", 0),
                    "llm_ds": row.get("LLM DS", 0),
                    "llm_pipo": row.get("LLM PIPO", 0),
                    "llm_fwa": row.get("LLM FWA", 0),
                    "llm_5g_site": row.get("LLM 5G Site", 0),

                    "lm_gross": row.get("LM Gross", 0),
                    "lm_mnp": row.get("LM MNP", 0),
                    "lm_trade_gross": row.get("LM Trade Gross", 0),
                    "lm_trade_mnp": row.get("LM Trade MNP", 0),
                    "lm_stock": row.get("LM Stock", 0),
                    "lm_ds": row.get("LM DS", 0),
                    "lm_pipo": row.get("LM PIPO", 0),
                    "lm_fwa": row.get("LM FWA", 0),
                    "lm_5g_site": row.get("LM 5G Site", 0),

                    "mtd_gross": row.get("MTD Gross", 0),
                    "mtd_mnp": row.get("MTD MNP", 0),
                    "mtd_trade_gross": row.get("MTD Trade Gross", 0),
                    "mtd_trade_mnp": row.get("MTD Trade MNP", 0),
                    "mtd_stock": row.get("MTD Stock", 0),
                    "mtd_ds": row.get("MTD DS", 0),
                    "mtd_pipo": row.get("MTD PIPO", 0),
                    "mtd_fwa": row.get("MTD FWA", 0),
                    "mtd_5g_site": row.get("MTD 5G Site", 0),

                    "llm_asc_norms": row.get("LLM ASC Norms", 0),
                    "llm_gt_sso": row.get("LLM GT SSO", 0),
                    "llm_dsso": row.get("LLM DSSO", 0),
                    "llm_mdsso": row.get("LLM MDSSO", 0),
                    "llm_sim_billing": row.get("LLM Sim Billing", 0),
                    "llm_m4_decay": row.get("LLM M4 Decay", 0),
                    "llm_auto_refill": row.get("LLM Auto Refill", 0),
                    "llm_tgt_vs_ach_4gmnp": row.get("LLM Tgt vs Ach 4GMNP", 0),

                    "lm_asc_norms": row.get("LM ASC Norms", 0),
                    "lm_gt_sso": row.get("LM GT SSO", 0),
                    "lm_dsso": row.get("LM DSSO", 0),
                    "lm_mdsso": row.get("LM MDSSO", 0),
                    "lm_sim_billing": row.get("LM Sim Billing", 0),
                    "lm_m4_decay": row.get("LM M4 Decay", 0),
                    "lm_auto_refill": row.get("LM Auto Refill", 0),
                    "lm_tgt_vs_ach_4gmnp": row.get("LM Tgt vs Ach 4GMNP", 0),

                    "mtd_asc_norms": row.get("MTD ASC Norms", 0),
                    "mtd_gt_sso": row.get("MTD GT SSO", 0),
                    "mtd_dsso": row.get("MTD DSSO", 0),
                    "mtd_mdsso": row.get("MTD MDSSO", 0),
                    "mtd_sim_billing": row.get("MTD Sim Billing", 0),
                    "mtd_m4_decay": row.get("MTD M4 Decay", 0),
                    "mtd_auto_refill": row.get("MTD Auto Refill", 0),
                    "mtd_tgt_vs_ach_4gmnp": row.get("MTD Tgt vs Ach 4GMNP", 0),

                    "incentive_tdp_5lm": row.get("Incentive TDP 5LM", 0),
                    "incentive_pli_5lm": row.get("Incentive PLI 5LM", 0),
                    "incentive_total_5lm": row.get("Incentive Total 5LM", 0),
                    "incentive_tdp_4lm": row.get("Incentive TDP 4LM", 0),
                    "incentive_pli_4lm": row.get("Incentive PLI 4LM", 0),
                    "incentive_total_4lm": row.get("Incentive Total 4LM", 0),
                    "incentive_tdp_3lm": row.get("Incentive TDP 3LM", 0),
                    "incentive_pli_3lm": row.get("Incentive PLI 3LM", 0),
                    "incentive_total_3lm": row.get("Incentive Total 3LM", 0),
                    "incentive_tdp_llm": row.get("Incentive TDP LLM", 0),
                    "incentive_pli_llm": row.get("Incentive PLI LLM", 0),
                    "incentive_total_llm": row.get("Incentive Total LLM", 0),
                    "incentive_tdp_lm": row.get("Incentive TDP LM", 0),
                    "incentive_pli_lm": row.get("Incentive PLI LM", 0),
                    "incentive_total_lm": row.get("Incentive Total LM", 0),

                    "rank_5lm": row.get("ZSM Wise Ranking_5LM", 0),
                    "rank_4lm": row.get("ZSM Wise Ranking_4LM", 0),
                    "rank_3lm": row.get("ZSM Wise Ranking_3LM", 0),
                    "rank_llm": row.get("ZSM Wise Ranking_LLM", 0),
                    "rank_lm": row.get("ZSM Wise Ranking_LM", 0),
                })

    return {
        "performance": performance,
        "performance_dtr": performance_dtr
    }
