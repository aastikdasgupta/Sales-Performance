import os
import sys
import random
import string
import pandas as pd

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database.db import SalesDB

# Original Admin Users
users_to_seed = [
    {
        "name": "Admin One",
        "photo": None,
        "username": "admin1",
        "password": "adminpass1",
        "role": "Admin",
        "email": "admin1@example.com",
        "phone": "9999999999"
    },
    {
        "name": "Admin Two",
        "photo": None,
        "username": "admin2",
        "password": "adminpass2",
        "role": "Admin",
        "email": "admin2@example.com",
        "phone": "8888888888"
    }
]

# Load the Excel and extract records
excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Performance_Sheet_.xlsx")
df = pd.read_excel(excel_path)

# Ensure we only use rows where RETAILER and Full Name exist
df = df[df['RETAILER'].notna() & df['Full Name'].notna()]

for i, row in df.iterrows():
    full_name = str(row['Full Name']).strip()
    phone = str(row['RETAILER']).strip()
    alt_phone = str(row['Alternate Number']).strip() if 'Alternate Number' in row else ""

    if len(phone) < 6:
        continue  # skip invalid phone numbers

    # Use last 6 digits of phone for password
    password = phone[-6:]

    user = {
        "name": full_name,
        "photo": None,
        "username": full_name.lower().replace(" ", "")[:12] + str(i),  # unique-ish username
        "password": password,
        "role": "Admin",
        "email": None,
        "phone": phone,
        "alt_phone": alt_phone
    }

    users_to_seed.append(user)

def seed_users():
    with SalesDB() as db:
        for user in users_to_seed:
            existing = db.get_records("users", [("phone", "=", user["phone"])])
            if not existing:
                db.add_record("users", user)
                print(f"Added user: {user['name']}")
            else:
                existing_user = existing[0]
                if existing_user["role"] != user["role"]:
                    db.update_records("users", [("phone", "=", user["phone"])], {"role": user["role"]})
                    print(f"Updated role for user: {user['name']} to {user['role']}")
                else:
                    print(f"User {user['name']} already exists with correct role.")

if __name__ == "__main__":
    seed_users()