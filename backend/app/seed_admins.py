import os
import sys
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

# === ASC Users ===
asc_excel_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ASC_Users.xlsx")
asc_df = pd.read_excel(asc_excel_path)
asc_df = asc_df[asc_df['RETAILER'].notna() & asc_df['Full Name'].notna()]

for i, row in asc_df.iterrows():
    full_name = str(row['Full Name']).strip()
    phone = str(row['RETAILER']).strip()
    alt_phone = str(row['Alternate Number']).strip() if 'Alternate Number' in row else ""
    role = str(row['Role']).strip()

    if len(phone) < 6:
        continue  # Skip invalid phone numbers

    password = phone[-6:]

    user = {
        "name": full_name,
        "photo": None,
        "username": full_name.lower().replace(" ", "")[:12] + str(i),
        "password": password,
        "role": role,
        "email": None,
        "phone": phone,
        "alt_phone": alt_phone,
        "zone": str(row.get("ZONE", "")).strip(),
        "dtr": str(row.get("DTR_NAME", "")).strip(),
        "tsm": str(row.get("TSM NAME", "")).strip(),
        "zsm": str(row.get("ZSM NAME", "")).strip()
    }

    users_to_seed.append(user)

# === Distributor Users ===
distributor_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Distributor_Users.xlsx")
distributor_df = pd.read_excel(distributor_path)
distributor_df = distributor_df[distributor_df['DTR MSISDN'].notna() & distributor_df['Full Name'].notna()]

for i, row in distributor_df.iterrows():
    full_name = str(row['Full Name']).strip()
    phone = str(row['DTR MSISDN']).strip()
    alt_phone = str(row['Alternate Number']).strip() if 'Alternate Number' in row else ""
    role = str(row['Role']).strip()

    if len(phone) < 6:
        continue

    password = phone[-6:]

    user = {
        "name": full_name,
        "photo": None,
        "username": full_name.lower().replace(" ", "")[:12] + "_d" + str(i),
        "password": password,
        "role": role,
        "email": None,
        "phone": phone,
        "alt_phone": alt_phone,
        "zone": "",
        "dtr": "",
        "tsm": "",
        "zsm": ""
    }

    users_to_seed.append(user)

# === Seeder Function ===
def seed_users():
    with SalesDB() as db:
        for user in users_to_seed:
            existing = db.get_records("users", [("phone", "=", user["phone"])])
            if not existing:
                db.add_record("users", user)
                print(f"Added user: {user['name']}")
            else:
                existing_user = existing[0]
                update_data = {}
                for field in ["role", "zone", "dtr", "tsm", "zsm"]:
                    if user.get(field) and user.get(field) != existing_user.get(field):
                        update_data[field] = user[field]
                if update_data:
                    db.update_records("users", [("phone", "=", user["phone"])], update_data)
                    print(f"Updated user: {user['name']} with {update_data}")
                else:
                    print(f"User {user['name']} already exists with correct data.")

if __name__ == "__main__":
    seed_users()
