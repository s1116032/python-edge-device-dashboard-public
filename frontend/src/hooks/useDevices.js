import { useState, useEffect } from 'react';
import { fetchAllDevices } from '../api';

export function useDevices(pollInterval = 5000) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 定義抓取資料的函式
    const fetchData = async () => {
      try {
        const data = await fetchAllDevices();
        setDevices(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
        setLoading(false);
      }
    };

    // 首次立即載入
    fetchData();

    // 設定每 5 秒輪詢一次
    const interval = setInterval(fetchData, pollInterval);

    // 元件卸載時清除計時器，避免記憶體洩漏
    return () => clearInterval(interval);
  }, [pollInterval]);

  return { devices, loading };
}