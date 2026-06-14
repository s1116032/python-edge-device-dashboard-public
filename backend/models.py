from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class HeartbeatPayload(BaseModel):
    device_id: str = Field(..., min_length=1, description="Device unique identifier")
    cpu_usage: float = Field(..., ge=0, le=100, description="CPU usage percentage")
    gpu_usage: float = Field(..., ge=0, le=100, description="GPU usage percentage")
    model_version: str = Field(..., min_length=1, description="Current model version")
    status: str = Field(..., pattern="^(Inspecting|Idle|Error)$", description="Device status")
    deploy_info: Optional[str] = Field(None, description="JSON string of deployment info")

class DeviceResponse(BaseModel):
    device_id: str
    cpu_usage: float
    gpu_usage: float
    model_version: str
    status: str
    last_heartbeat: datetime
    deploy_info: Optional[str] = None