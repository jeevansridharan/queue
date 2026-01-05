
import React, { useState } from 'react';
import { AppView, Order } from './types';
import StudentDashboard from './components/StudentDashboard';
import VendorDashboard from './components/VendorDashboard';
import AIInsights from './components/AIInsights';
import ChatPanel from './components/ChatPanel';
import XeroxModule from './components/XeroxModule';
import ImaginePanel from './components/ImaginePanel';
import SearchPanel from './components/SearchPanel';
import LivePanel from './components/LivePanel';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.STUDENT_DASHBOARD);
  const [orders, setOrders] = useState<Order[]>([
    { id: '101', type: 'canteen', items: 'Masala Dosa, Coffee', total: 65, status: 'preparing', pickupSlot: '12:30 PM', timestamp: Date.now(), studentName: 'Alex' },
    { id: '102', type: 'xerox', items: 'Physics Notes (12 pgs)', total: 24, status: 'pending', pickupSlot: '01:00 PM', timestamp: Date.now(), studentName: 'John' }
  ]);

  const addOrder = (newOrder: Order) => setOrders([newOrder, ...orders]);
  const updateStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const NavItem = ({ view, label, icon }: { view: AppView, label: string, icon: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === view
          ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
          : 'text-slate-400 hover:bg-slate-800/50'
      }`}
    >
      <span>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col p-6 hidden md:flex overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-600/20">R</div>
          <h1 className="text-xl font-bold tracking-tight">RushX</h1>
        </div>

        <div className="space-y-8">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Service</div>
            <nav className="flex flex-col gap-1">
              <NavItem view={AppView.STUDENT_DASHBOARD} label="Canteen Order" icon="🍔" />
              <NavItem view={AppView.STUDENT_XEROX} label="Xerox Upload" icon="📄" />
            </nav>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Management</div>
            <nav className="flex flex-col gap-1">
              <NavItem view={AppView.VENDOR_DASHBOARD} label="Order Queue" icon="📋" />
              <NavItem view={AppView.AI_INSIGHTS} label="Rush Analysis" icon="📈" />
            </nav>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">AI Lab</div>
            <nav className="flex flex-col gap-1">
              <NavItem view={AppView.CHAT_SUPPORT} label="Nexus Assistant" icon="💬" />
              <NavItem view={AppView.AI_IMAGINE} label="Art Creator" icon="🎨" />
              <NavItem view={AppView.AI_SEARCH} label="Smart Search" icon="🔍" />
              <NavItem view={AppView.AI_VOICE} label="Voice Mode" icon="🎙️" />
            </nav>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-slate-800/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-indigo-500"></div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold truncate">Demo Student</div>
              <div className="text-[10px] text-slate-500 truncate">S123456@university.edu</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-900/5 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto">
          {currentView === AppView.STUDENT_DASHBOARD && <StudentDashboard onOrder={addOrder} />}
          {currentView === AppView.STUDENT_XEROX && <XeroxModule onOrder={addOrder} />}
          {currentView === AppView.VENDOR_DASHBOARD && <VendorDashboard orders={orders} onUpdate={updateStatus} />}
          {currentView === AppView.AI_INSIGHTS && <AIInsights orders={orders} />}
          {currentView === AppView.CHAT_SUPPORT && <ChatPanel />}
          {currentView === AppView.AI_IMAGINE && <ImaginePanel />}
          {currentView === AppView.AI_SEARCH && <SearchPanel />}
          {currentView === AppView.AI_VOICE && <LivePanel />}
        </div>
      </main>
    </div>
  );
};

export default App;
