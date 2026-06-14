const StatCard = ({ title, count, color }) => (
  <div className={`p-4 rounded-lg shadow-sm border-l-4 ${color} bg-white`}>
    <h3 className="text-sm font-medium text-slate-500">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{count}</p>
  </div>
);

export default function StatsPanel({ devices }) {
  const now = new Date();

  // 計算離線設備 (超過 30 秒無心跳)
  const isOffline = (device) => (now - new Date(device.last_heartbeat)) / 1000 > 30;

  const totalDevices = devices.length;
  const offlineCount = devices.filter(d => isOffline(d)).length;
  
  // 只有在「非離線」狀態下，才計算 Error, Inspecting, Idle
  const errorCount = devices.filter(d => !isOffline(d) && d.status === 'Error').length;
  const inspectingCount = devices.filter(d => !isOffline(d) && d.status === 'Inspecting').length;
  const idleCount = devices.filter(d => !isOffline(d) && d.status === 'Idle').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <StatCard title="總設備數" count={totalDevices} color="border-slate-500" />
      <StatCard title="運行中" count={inspectingCount} color="border-blue-500" />
      <StatCard title="閒置" count={idleCount} color="border-slate-300" />
      <StatCard title="錯誤" count={errorCount} color="border-red-500" />
      <StatCard title="離線" count={offlineCount} color="border-gray-500" />
    </div>
  );
}