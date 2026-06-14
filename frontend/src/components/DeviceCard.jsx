export default function DeviceCard({ device, onSelect }) {
  const now = new Date();
  const lastHeartbeat = new Date(device.last_heartbeat);
  const secondsSinceLastHeartbeat = (now - lastHeartbeat) / 1000;
  
  // 核心邏輯：超過 30 秒強制覆蓋為 Offline
  const isOffline = secondsSinceLastHeartbeat > 30;

  let statusText = device.status;
  let cardStyles = "border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-2";

  if (isOffline) {
    statusText = "Offline";
    cardStyles += " bg-gray-200 border-gray-500 text-gray-600";
  } else if (device.status === "Error") {
    // Error: 紅底 + Tailwind 內建閃爍動畫
    cardStyles += " bg-red-50 border-red-500 text-red-800 animate-pulse";
  } else if (device.status === "Inspecting") {
    // Inspecting: 藍底
    cardStyles += " bg-blue-50 border-blue-500 text-blue-800";
  } else {
    // Idle: 灰白底
    cardStyles += " bg-white border-slate-300 text-slate-800";
  }

  // 格式化心跳時間顯示
  const timeFormatter = new Intl.RelativeTimeFormat('zh-TW', { numeric: 'auto' });
  const displayTime = isOffline 
    ? timeFormatter.format(Math.round(-secondsSinceLastHeartbeat), 'second')
    : lastHeartbeat.toLocaleTimeString('zh-TW');

  return (
    <div 
      className={cardStyles} 
      onClick={() => onSelect(device.device_id)}
      title="點擊查看詳細資訊"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold font-mono">{device.device_id}</h3>
        <span className="text-xs font-semibold px-2 py-1 rounded bg-black/10">
          {statusText}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mt-1">
        <div>CPU: <span className="font-mono">{device.cpu_usage}%</span></div>
        <div>GPU: <span className="font-mono">{device.gpu_usage}%</span></div>
      </div>

      <div className="text-xs text-right opacity-75 mt-2">
        最後心跳: {displayTime}
      </div>
    </div>
  );
}