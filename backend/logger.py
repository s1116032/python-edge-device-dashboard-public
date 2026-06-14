import logging
from logging.handlers import RotatingFileHandler
import os

LOG_DIR = "data"
LOG_FILE = os.path.join(LOG_DIR, "app.log")

# 確保 data 目錄存在
os.makedirs(LOG_DIR, exist_ok=True)

def setup_logger():
    logger = logging.getLogger("edge_dashboard")
    logger.setLevel(logging.INFO)
    
    # 避免重複添加 handler
    if not logger.handlers:
        # RotatingFileHandler: 每個檔案最大 1MB，最多保留 3 個備份
        handler = RotatingFileHandler(LOG_FILE, maxBytes=1024*1024, backupCount=3)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
        # 同時輸出到終端機方便開發 Debug
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)
        
    return logger

logger = setup_logger()