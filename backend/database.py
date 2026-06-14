import sqlite3
import os
from datetime import datetime

DB_DIR = "data"
DB_FILE = os.path.join(DB_DIR, "devices.db")

os.makedirs(DB_DIR, exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row # 讓查詢結果可以用欄位名稱取值
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS device_status (
            device_id TEXT PRIMARY KEY,
            cpu_usage REAL,
            gpu_usage REAL,
            model_version TEXT,
            status TEXT,
            last_heartbeat DATETIME,
            deploy_info TEXT
        )
    """)
    conn.commit()
    conn.close()

def upsert_device(data: dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 重點：Upsert 邏輯，遇到重複 device_id 僅更新指定欄位
    cursor.execute("""
        INSERT INTO device_status (device_id, cpu_usage, gpu_usage, model_version, status, last_heartbeat, deploy_info)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(device_id) DO UPDATE SET
            cpu_usage=excluded.cpu_usage,
            gpu_usage=excluded.gpu_usage,
            model_version=excluded.model_version,
            status=excluded.status,
            last_heartbeat=excluded.last_heartbeat,
            deploy_info=COALESCE(excluded.deploy_info, device_status.deploy_info)
    """, (
        data['device_id'], 
        data['cpu_usage'], 
        data['gpu_usage'], 
        data['model_version'], 
        data['status'], 
        datetime.now(), # 紀錄伺服器收到時間
        data.get('deploy_info')
    ))
    conn.commit()
    conn.close()

def get_all_devices() -> list[dict]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM device_status")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_device_by_id(device_id: str) -> dict | None:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM device_status WHERE device_id = ?", (device_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None