import { useState } from 'react'
import { useDevices } from './hooks/useDevices'
import { fetchDeviceDetail } from './api'
import StatsPanel from './components/StatsPanel'
import DeviceCard from './components/DeviceCard'
import DeviceModal from './components/DeviceModal'

export default function App() {
  const { devices, loading } = useDevices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // 點擊卡片時，呼叫 GET /api/devices/{device_id} 取得最新詳情
  const handleSelectDevice = async (deviceId) => {
    try {
      const detail = await fetchDeviceDetail(deviceId);
      setSelectedDevice(detail);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch device detail:", error);
    }
  };

  if (loading && devices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-slate-500 animate-pulse">載入設備資料中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edge Device Dashboard</h1>
      
      {/* 統計面板 */}
      <StatsPanel devices={devices} />

      {/* 設備卡片 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device) => (
          <DeviceCard 
            key={device.device_id} 
            device={device} 
            onSelect={handleSelectDevice} 
          />
        ))}
      </div>

      {/* 空狀態處理 */}
      {devices.length === 0 && !loading && (
        <div className="text-center py-10 text-slate-400">
          尚未收到任何設備的心跳資料。請確認模擬器是否已啟動。
        </div>
      )}

      {/* 詳情 Modal */}
      <DeviceModal 
        isOpen={isModalOpen} 
        closeModal={() => setIsModalOpen(false)} 
        device={selectedDevice} 
      />
    </div>
  )
}