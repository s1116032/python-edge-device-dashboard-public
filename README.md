# Edge Device Dashboard

一個專為 Edge AI 設備設計的即時監控看板，展示了技術選型取捨與工程品質。

## ✨ 特色

- **Upsert 心跳機制**：SQLite 實作 `ON CONFLICT DO UPDATE`，只保留最新狀態，拋棄繁重的 Time-series DB，極致輕量。
- **防暴雷日誌系統**：Python `RotatingFileHandler`，防止設備狂發 Error Log 导致硬碟爆滿，並針對 Error 狀態寫入 `ERROR` 等級。
- **嚴格資料驗證**：FastAPI + Pydantic 強驗證心跳 Payload（如 CPU/GPU 0-100 區間），非法資料直接 422 擋下。
- **即時狀態動畫**：前端 5 秒 Polling 串接，無需複雜的 WebSocket。使用 Tailwind 實作 Error 紅色閃爍 (`animate-pulse`) 與 30 秒無心跳自動覆蓋為 Offline。

## 🛠 技術棧

- **Backend**: FastAPI, SQLite, Pydantic, Uvicorn
- **Frontend**: React, Vite, Tailwind CSS (v3), Headless UI
- **Architecture**: RESTful API, Polling (5s interval)

## 🚀 快速啟動

### 環境需求
- Python 3.8+
- Node.js 16+

### 1. 後端啟動

```bash
# 進入後端目錄
cd backend

# 安裝依賴 (包含 FastAPI 與模擬器需要的 requests)
pip install -r requirements.txt

# 啟動伺服器
uvicorn main:app --reload --port 8000
```
後端將運行在 `http://localhost:8000`，API 文件可見 `http://localhost:8000/docs`。

### 2. 模擬器啟動 (產生測試數據)

**請另開一個終端機**

```bash
cd backend

# 執行模擬器，每 1~4 秒隨機發送設備心跳
python simulator.py
```

### 3. 前端啟動

**請另開一個終端機**

```bash
# 進入前端目錄
cd frontend

# 安裝依賴
npm install

# 啟動 Vite 開發伺服器
npm run dev
```
前端看板將運行在 `http://localhost:5173`，並透過 Proxy 轉發 API 至後端。

## 📂 專案架構

```text
edge-device-dashboard/
├── README.md
├── .gitignore
│
├── backend/                  # FastAPI 後端
│   ├── main.py               # App 進入點、CORS
│   ├── database.py           # SQLite 連線、Upsert 邏輯
│   ├── models.py             # Pydantic 資料驗證模型
│   ├── api.py                # API 路由層
│   ├── logger.py             # RotatingFileHandler 設定
│   ├── simulator.py          # 設備心跳模擬器
│   ├── requirements.txt      # Python 依賴
│   └── data/                 # 自動生成 (Git 忽略)
│       ├── devices.db
│       └── app.log
│
└── frontend/                 # React + Vite 前端
    ├── vite.config.js        # Proxy 設定
    ├── tailwind.config.js    # Tailwind v3 設定
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── App.jsx           # 主佈局
        ├── index.css         # Tailwind 引入
        ├── api.js            # API 呼叫封裝
        ├── hooks/
        │   └── useDevices.js # 5 秒 Polling 邏輯
        └── components/
            ├── StatsPanel.jsx    # 頂部統計數據
            ├── DeviceCard.jsx    # 設備卡片 (狀態變色/閃爍)
            └── DeviceModal.jsx   # Headless UI 詳情彈窗
```

## 🔌 API 端點

| Method   | Path                   | Description                          |
| :------- | :--------------------- | :----------------------------------- |
| `POST`   | `/api/heartbeat`       | 接收設備心跳，觸發 Upsert 並寫入 Log |
| `GET`    | `/api/devices`         | 一次性取得所有設備最新狀態           |
| `GET`    | `/api/devices/{id}`    | 取得特定設備的詳細部署資訊           |

## License
Copyright © 2026 hanwu910514.

詳情請參閱[Apache License 2.0](LICENSE)檔案
