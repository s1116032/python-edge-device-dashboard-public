from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from api import router as api_router

# 初始化資料庫
init_db()

app = FastAPI(title="Edge Device Dashboard API")

# 跨域設定，讓前端 Vite 能順利打 API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開發先全開，實務上應鎖定 localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Edge Device Dashboard API is running."}
