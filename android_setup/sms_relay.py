import requests
import time
import os
import json
from datetime import datetime

API_URL = "https://qride.vercel.app/api/fetch-messages?secret=changeme"  # Replace with your actual URL
POLL_INTERVAL = 10  # seconds
LOG_PATH = "/storage/emulated/0/QRide/sms_status.json"

def log_status(phone, message, status):
    entry = {
        "phone": phone,
        "message": message,
        "status": status,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    try:
        data = []
        if os.path.exists(LOG_PATH):
            with open(LOG_PATH, 'r') as f:
                try:
                    data = json.load(f)
                except Exception:
                    data = []
        data.append(entry)
        with open(LOG_PATH, 'w') as f:
            json.dump(data, f)
    except Exception as e:
        print("Log error:", e)

def send_sms(phone, message):
    # Use termux-sms-send to send SMS
    result = os.system(f'termux-sms-send -n "{phone}" "{message}"')
    return result == 0  # True if success

def main():
    while True:
        try:
            resp = requests.get(API_URL)
            data = resp.json()
            messages = data.get("messages", [])
            for msg in messages:
                phone = msg.get("phone_number")
                text = msg.get("message")
                if phone and text:
                    print(f"Sending SMS to {phone}: {text}")
                    success = send_sms(phone, text)
                    status = "success" if success else "failed"
                    log_status(phone, text, status)
        except Exception as e:
            print("Error:", e)
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main() 