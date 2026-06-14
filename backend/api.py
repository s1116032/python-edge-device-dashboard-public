from fastapi import APIRouter, HTTPException
from models import HeartbeatPayload, DeviceResponse
from database import upsert_device, get_all_devices, get_device_by_id
from logger import logger

router = APIRouter()


@router.post("/heartbeat")
def receive_heartbeat(payload: HeartbeatPayload):
    try:
        # 將 Pydantic model 轉為 dict 丟進 DB
        data = payload.model_dump()
        upsert_device(data)

        # 針對 Error 狀態寫入 ERROR 等級 Log
        if payload.status == "Error":
            logger.error(
                f"Device {payload.device_id} reported ERROR status! CPU: {payload.cpu_usage}%, GPU: {payload.gpu_usage}%"
            )
        else:
            logger.info(
                f"Heartbeat received from {payload.device_id} (Status: {payload.status})"
            )

        return {"message": "Heartbeat received", "device_id": payload.device_id}

    except Exception as e:
        # 避免寫入 DB 失敗導致 Server Crash
        logger.error(f"Failed to process heartbeat for {payload.device_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Internal server error while saving heartbeat"
        )


@router.get("/devices", response_model=list[DeviceResponse])
def read_all_devices():
    try:
        devices = get_all_devices()
        return devices
    except Exception as e:
        logger.error(f"Failed to fetch devices: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch devices")


@router.get("/devices/{device_id}", response_model=DeviceResponse)
def read_device_detail(device_id: str):
    device = get_device_by_id(device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device
