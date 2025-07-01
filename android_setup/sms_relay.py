import requests
import time
import os
import json
from datetime import datetime
import socket

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

def has_sms_reply(phone, since_ts):
    # Use termux-sms-list to check for incoming SMS from phone after since_ts
    import subprocess
    import time as pytime
    try:
        out = subprocess.check_output(['termux-sms-list', '-t', 'inbox', '-l', '20'])
        sms_list = json.loads(out)
        phone_clean = phone.replace('+', '').replace(' ', '').replace('-', '')[-8:]  # last 8 digits for matching
        for sms in sms_list:
            if sms.get('received') and sms.get('received') > since_ts:
                sender = sms.get('address', '')
                if phone_clean in sender[-8:]:
                    return True
    except Exception as e:
        print("SMS check error:", e)
    return False

def is_connected():
    try:
        # Try to connect to a public DNS server
        socket.create_connection(("8.8.8.8", 53), timeout=2)
        return True
    except OSError:
        return False

def main():
    was_online = None
    while True:
        online = is_connected()
        if not online:
            if was_online is not False:
                print("⛔️Offline")
            was_online = False
            time.sleep(POLL_INTERVAL)
            continue
        else:
            if was_online is not True:
                print("✅Back Online")
            was_online = True
        try:
            resp = requests.get(API_URL)
            data = resp.json()
            messages = data.get("messages", [])
            for msg in messages:
                phone = msg.get("phone_number")
                text = msg.get("message")
                if phone and text:
                    print(f"Sending SMS to {phone}: {text}")
                    sms_success = send_sms(phone, text)
                    log_status(phone, text, "sms_success" if sms_success else "sms_failed")
        except Exception as e:
            print("Error:", e)
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main() 