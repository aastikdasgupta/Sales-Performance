from datetime import datetime
from dateutil.relativedelta import relativedelta

ROLE_KPIS = {
    "ASC": ["mnp", "mdsso", "fwa", "sim_billing", "jmnp", "3mnp", "mnp_tgt_act"],
    "Distributor": ["gross", "mnp", "jpipo", "mdsso", "fwa", "jio_mnp"],
    "Promoter": ["gross", "mnp", "jpipo", "site_visits", "jio_mnp"],
    "XFE": ["mnp", "site_visits", "activations", "jio_mnp"]
}

MONTH_MAP = {
    1: "January", 2: "February", 3: "March", 4: "April", 5: "May",
    6: "June", 7: "July", 8: "August", 9: "September", 10: "October",
    11: "November", 12: "December"
}

MONTH_PREFIXES = ["llm", "lm", "mtd"]  # For performance data
INCENTIVE_SUFFIXES = ["5lm", "4lm", "3lm", "llm","lm"]  # For incentive data

def get_last_3_months():
    """
    Returns a list of (year, month_number) tuples for the last 3 months.
    Example: [(2025, 3), (2025, 4), (2025, 5)]
    """
    today = datetime.today().replace(day=1)
    months = []
    for i in range(3):
        month = today.month - i
        year = today.year
        if month <= 0:
            month += 12
            year -= 1
        months.append((year, month))
    return months[::-1]  # Most recent last

def get_suffix_months():
    """
    Returns a list of (suffix, (year, month), month_name) tuples for the incentive suffixes.
    Example: [("6lm", (2024, 12), "December"), ..., ("llm", (2025, 5), "May")]
    """
    today = datetime.today().replace(day=1)
    suffix_offsets = {
        "5lm": -5,
        "4lm": -4,
        "3lm": -3,
        "llm": -2,
        "lm": -1
    }
    result = []
    for suffix, offset in suffix_offsets.items():
        target = today + relativedelta(months=offset)
        year = target.year
        month = target.month
        month_name = MONTH_MAP[month]
        result.append((suffix, (year, month), month_name))
    return result
