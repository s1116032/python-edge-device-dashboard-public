import requests
import random
import time
import json
from datetime import datetime

API_URL = "http://127.0.0.1:8000/api/heartbeat"

# 模擬 5 台邊緣設備
DEVICE_IDS = [f"edge-cam-0{i}" for i in range(1, 6)]
STATUSES = ["Inspecting", "Idle", "Error"]
MODELS = ["yolov8n", "yolov8s", "resnet50"]

def generate_heartbeat():
    device_id = random.choice(DEVICE_IDS)
    status = random.choices(STATUSES, weights=[0.6, 0.3, 0.1])[0] # 60% 運行, 30% 閒置, 10% 錯誤
    
    payload = {
        "device_id": device_id,
        "cpu_usage": round(random.uniform(10, 95), 1),
        "gpu_usage": round(random.uniform(20, 99), 1),
        "model_version": random.choice(MODELS),
        "status": status,
    }
    
    # 偶爾附帶 deploy_info
    if random.random() > 0.7:
        payload["deploy_info"] = json.dumps({
            "deployed_by": "admin",
            "version": "v1.2.4",
            "timestamp": datetime.now().isoformat()
        })
        
    return payload

if __name__ == "__main__":
    print("🚀 Starting device simulator... (Press Ctrl+C to stop)")
    time.sleep(2) # 等待 FastAPI 啟動
    
    while True:
        try:
            payload = generate_heartbeat()
            response = requests.post(API_URL, json=payload)
            
            if response.status_code == 200:
                print(f"✅ Sent heartbeat from {payload['device_id']} | Status: {payload['status']}")
            else:
                print(f"❌ Failed to send heartbeat: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("⚠️ Backend is not reachable. Retrying in 5 seconds...")
            
        # 隨機間隔 1~4 秒發送一次
        time.sleep(random.uniform(1, 4))