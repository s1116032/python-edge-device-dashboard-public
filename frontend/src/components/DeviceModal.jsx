import { Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

export default function DeviceModal({ isOpen, closeModal, device }) {
  if (!device) return null;

  // 解析 deploy_info (後端傳來的是 JSON 字串)
  let deployInfo = null;
  try {
    if (device.deploy_info) {
      deployInfo = JSON.parse(device.deploy_info);
    }
  } catch (e) {
    deployInfo = { error: "Invalid deploy info format" };
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                  <span>設備詳情：{device.device_id}</span>
                  <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">{device.status}</span>
                </DialogTitle>
                
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">CPU Usage</p>
                      <p className="font-mono font-bold text-gray-800">{device.cpu_usage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">GPU Usage</p>
                      <p className="font-mono font-bold text-gray-800">{device.gpu_usage}%</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-500">Model Version</p>
                    <p className="font-mono font-bold text-gray-800">{device.model_version}</p>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-500">最後心跳時間</p>
                    <p className="font-mono text-gray-800">{new Date(device.last_heartbeat).toLocaleString('zh-TW')}</p>
                  </div>

                  {/* 顯示部署資訊 */}
                  {deployInfo && (
                    <div className="mt-2 p-3 bg-slate-50 rounded border border-slate-200">
                      <p className="text-sm font-semibold text-gray-600 mb-2">部署資訊 (Deploy Info)</p>
                      <pre className="text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(deployInfo, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    關閉
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}