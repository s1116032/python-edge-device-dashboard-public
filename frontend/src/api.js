const API_BASE = '/api';

export async function fetchAllDevices() {
  const response = await fetch(`${API_BASE}/devices`);
  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }
  return response.json();
}

export async function fetchDeviceDetail(deviceId) {
  const response = await fetch(`${API_BASE}/devices/${deviceId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch device detail');
  }
  return response.json();
}