
import React, { useState } from 'react';
import { Order, MenuItem } from '../types';

const MENU: MenuItem[] = [
  { id: 'm1', name: 'Masala Dosa', price: 50, category: 'South Indian' },
  { id: 'm2', name: 'Veg Burger', price: 70, category: 'Fast Food' },
  { id: 'm3', name: 'Cold Coffee', price: 40, category: 'Beverages' },
  { id: 'm4', name: 'Samosa (2pcs)', price: 20, category: 'Snacks' },
];

const StudentDashboard: React.FC<{ onOrder: (o: Order) => void }> = ({ onOrder }) => {
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [isOrdering, setIsOrdering] = useState(false);

  const total = MENU.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);

  const handleOrder = () => {
    if (total === 0) return;
    setIsOrdering(true);
    setTimeout(() => {
      onOrder({
        id: Math.floor(Math.random() * 1000).toString(),
        type: 'canteen',
        items: MENU.filter(m => cart[m.id]).map(m => `${m.name} x${cart[m.id]}`).join(', '),
        total,
        status: 'pending',
        pickupSlot: 'Next Available',
        timestamp: Date.now(),
        studentName: 'Demo Student'
      });
      setCart({});
      setIsOrdering(false);
      alert("Order placed! Track it in the queue.");
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Canteen Menu</h2>
        <p className="text-slate-400">Fresh food, zero waiting time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
        {MENU.map(item => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-orange-500/50 transition-colors">
            <div>
              <h4 className="font-bold text-lg">{item.name}</h4>
              <span className="text-sm text-slate-500">{item.category} • ₹{item.price}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCart(p => ({ ...p, [item.id]: Math.max(0, (p[item.id] || 0) - 1) }))}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700">-</button>
              <span className="w-4 text-center">{cart[item.id] || 0}</span>
              <button 
                onClick={() => setCart(p => ({ ...p, [item.id]: (p[item.id] || 0) + 1 }))}
                className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-500">+</button>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="fixed bottom-8 right-8 left-8 md:left-auto md:w-96 bg-slate-900 border border-orange-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Total Amount</span>
            <span className="text-2xl font-bold text-orange-500">₹{total}</span>
          </div>
          <button 
            disabled={isOrdering}
            onClick={handleOrder}
            className="w-full bg-orange-600 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 disabled:opacity-50 transition-all"
          >
            {isOrdering ? 'Processing Payment...' : 'Checkout & Pay'}
          </button>
          <p className="text-[10px] text-center text-slate-500 mt-3">Secure Mock UPI Payment</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
