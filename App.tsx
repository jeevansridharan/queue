

import React, { useState, useEffect } from 'react';
import { AppView, Order, User, UserRole, MenuItem } from './types';
import StudentDashboard from './components/StudentDashboard';
import VendorDashboard from './components/VendorDashboard';
import AIInsights from './components/AIInsights';
import ChatPanel from './components/ChatPanel';
import XeroxModule from './components/XeroxModule';
import LivePanel from './components/LivePanel';
import Login from './components/Login';
import Profile from './components/Profile';
import StockManager from './components/StockManager';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.STUDENT_DASHBOARD);
  const [orders, setOrders] = useState<Order[]>([
    { id: '101', type: 'canteen', items: 'Masala Dosa, Coffee', total: 65, status: 'preparing', pickupSlot: '12:30 PM', timestamp: Date.now(), studentName: 'Updated Student' },
    { id: '102', type: 'xerox', items: 'Physics Notes (12 pgs)', total: 24, status: 'pending', pickupSlot: '01:00 PM', timestamp: Date.now(), studentName: 'Updated Student' },
    { id: '103', type: 'canteen', items: 'Idli Sambar, Tea', total: 45, status: 'completed', pickupSlot: '09:00 AM', timestamp: Date.now() - 86400000, studentName: 'Updated Student' },
    { id: '104', type: 'xerox', items: 'Math Assignment (8 pgs)', total: 16, status: 'completed', pickupSlot: '10:30 AM', timestamp: Date.now() - 172800000, studentName: 'Updated Student' },
    { id: '105', type: 'canteen', items: 'Vada Pav, Cold Coffee', total: 55, status: 'ready', pickupSlot: '02:00 PM', timestamp: Date.now() - 3600000, studentName: 'Updated Student' },
    { id: '106', type: 'canteen', items: 'Paneer Sandwich, Juice', total: 80, status: 'completed', pickupSlot: '11:00 AM', timestamp: Date.now() - 259200000, studentName: 'Updated Student' }
  ]);

  const [menu, setMenu] = useState<MenuItem[]>([
    { id: 'm1', name: 'Masala Dosa', price: 50, category: 'South Indian', inStock: true, stockCount: 15 },
    { id: 'm2', name: 'Veg Burger', price: 70, category: 'Fast Food', inStock: true, stockCount: 8 },
    { id: 'm3', name: 'Cold Coffee', price: 40, category: 'Beverages', inStock: true, stockCount: 20 },
    { id: 'm4', name: 'Samosa (2pcs)', price: 20, category: 'Snacks', inStock: false, stockCount: 0 },
    { id: 'm5', name: 'Paneer Sandwich', price: 60, category: 'Fast Food', inStock: true, stockCount: 5 },
    { id: 'm6', name: 'Chai', price: 15, category: 'Beverages', inStock: true, stockCount: 30 },
  ]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rushx_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('rushx_user');
      }
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('rushx_user', JSON.stringify(loggedInUser));

    // Set default view based on role
    if (loggedInUser.role === 'student') {
      setCurrentView(AppView.STUDENT_DASHBOARD);
    } else {
      setCurrentView(AppView.VENDOR_DASHBOARD);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rushx_user');
    setCurrentView(AppView.STUDENT_DASHBOARD);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('rushx_user', JSON.stringify(updatedUser));
  };

  const addOrder = (newOrder: Order) => setOrders([newOrder, ...orders]);
  const updateStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // Filter views based on user role
  const getAvailableViews = (): AppView[] => {
    if (!user) return [];

    if (user.role === 'student') {
      return [
        AppView.STUDENT_DASHBOARD,
        AppView.STUDENT_XEROX,
        AppView.CHAT_SUPPORT,
        AppView.AI_VOICE,
        AppView.PROFILE
      ];
    } else if (user.role === 'canteen') {
      // Canteen role gets stock management
      return [AppView.VENDOR_DASHBOARD, AppView.STOCK_MANAGER, AppView.AI_INSIGHTS, AppView.PROFILE];
    } else {
      // Xerox role
      return [AppView.VENDOR_DASHBOARD, AppView.AI_INSIGHTS, AppView.PROFILE];
    }
  };

  const NavItem = ({ view, label, icon }: { view: AppView, label: string, icon: string }) => {
    const availableViews = getAvailableViews();
    if (!availableViews.includes(view)) return null;

    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === view
          ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
          : 'text-slate-400 hover:bg-slate-800/50'
          }`}
      >
        <span>{icon}</span>
        <span className="font-medium text-sm">{label}</span>
      </button>
    );
  };

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Filter orders for vendor dashboard based on role
  const filteredOrders = user.role === 'canteen'
    ? orders.filter(o => o.type === 'canteen')
    : user.role === 'xerox'
      ? orders.filter(o => o.type === 'xerox')
      : orders;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col p-6 hidden md:flex overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-600/20">R</div>
          <h1 className="text-xl font-bold tracking-tight">RushX</h1>
        </div>

        <div className="space-y-8">
          {user.role === 'student' && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Service</div>
              <nav className="flex flex-col gap-1">
                <NavItem view={AppView.STUDENT_DASHBOARD} label="Canteen Order" icon="🍔" />
                <NavItem view={AppView.STUDENT_XEROX} label="Xerox Upload" icon="📄" />
              </nav>
            </div>
          )}

          {(user.role === 'canteen' || user.role === 'xerox') && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Management</div>
              <nav className="flex flex-col gap-1">
                <NavItem view={AppView.VENDOR_DASHBOARD} label="Order Queue" icon="📋" />
                {user.role === 'canteen' && (
                  <NavItem view={AppView.STOCK_MANAGER} label="Stock Manager" icon="📦" />
                )}
                <NavItem view={AppView.AI_INSIGHTS} label="Rush Analysis" icon="📈" />
              </nav>
            </div>
          )}

          {user.role === 'student' && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">AI Lab</div>
              <nav className="flex flex-col gap-1">
                <NavItem view={AppView.CHAT_SUPPORT} label="Nexus Assistant" icon="💬" />
                <NavItem view={AppView.AI_VOICE} label="Voice Mode" icon="🎙️" />
              </nav>
            </div>
          )}

          {/* Profile Section - Available to All Users */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Account</div>
            <nav className="flex flex-col gap-1">
              <NavItem view={AppView.PROFILE} label="My Profile" icon="👤" />
            </nav>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-slate-800/30 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-indigo-500 flex items-center justify-center text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 truncate capitalize">{user.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-slate-400 hover:text-orange-400 hover:bg-slate-800/50 rounded-lg transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-900/5 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto">
          {currentView === AppView.STUDENT_DASHBOARD && <StudentDashboard onOrder={addOrder} userName={user.name} />}
          {currentView === AppView.STUDENT_XEROX && <XeroxModule onOrder={addOrder} userName={user.name} />}
          {currentView === AppView.VENDOR_DASHBOARD && <VendorDashboard orders={filteredOrders} onUpdate={updateStatus} userRole={user.role} />}
          {currentView === AppView.STOCK_MANAGER && <StockManager initialMenu={menu} onUpdateStock={setMenu} />}
          {currentView === AppView.AI_INSIGHTS && <AIInsights orders={filteredOrders} />}
          {currentView === AppView.CHAT_SUPPORT && <ChatPanel />}
          {currentView === AppView.AI_VOICE && <LivePanel />}
          {currentView === AppView.PROFILE && <Profile user={user} onUpdateUser={handleUpdateUser} orders={orders} />}
        </div>
      </main>
    </div>
  );
};

export default App;
