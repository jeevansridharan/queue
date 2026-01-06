
import React from 'react';
import { Order, OrderStatus, UserRole } from '../types';

const VendorDashboard: React.FC<{ orders: Order[], onUpdate: (id: string, s: OrderStatus) => void, userRole: UserRole }> = ({ orders, onUpdate, userRole }) => {
  const getHeaderText = () => {
    if (userRole === 'canteen') return 'Live queue management for Central Canteen';
    if (userRole === 'xerox') return 'Live queue management for Xerox Center';
    return 'Live queue management';
  };

  const handleDownload = (order: Order) => {
    if (!order.fileData || !order.fileName) return;

    // Create a download link
    const link = document.createElement('a');
    link.href = order.fileData;
    link.download = order.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold">Incoming Orders</h2>
          <p className="text-slate-400">{getHeaderText()}</p>
        </div>
        <button className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          📸 Scan QR
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {orders.filter(o => o.status !== 'completed').map(order => (
          <div key={order.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.type === 'canteen' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {order.type}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">#{order.id}</span>
                  <span className="text-slate-300 font-bold">{order.studentName}</span>
                </div>
                <p className="text-lg font-medium">{order.items}</p>
                <div className="text-xs text-slate-500 mt-2">Pickup: {order.pickupSlot}</div>
              </div>

              <div className="flex items-center gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => onUpdate(order.id, 'preparing')}
                    className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-bold">
                    {order.type === 'canteen' ? 'Start Cooking' : 'Start Printing'}
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => onUpdate(order.id, 'ready')}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl text-sm font-bold">Mark Ready</button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => onUpdate(order.id, 'completed')}
                    className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl text-sm font-bold">Handed Over</button>
                )}
              </div>
            </div>

            {/* File download section for xerox orders */}
            {order.type === 'xerox' && order.fileData && (
              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-xl">
                      📄
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{order.fileName}</div>
                      <div className="text-xs text-slate-500">{formatFileSize(order.fileSize)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(order)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                  >
                    <span>⬇️</span>
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.filter(o => o.status !== 'completed').length === 0 && (
          <div className="text-center py-20 text-slate-600">No active orders in queue.</div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
