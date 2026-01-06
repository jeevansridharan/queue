
import React, { useState } from 'react';
import { Order, MenuItem } from '../types';

const MENU: MenuItem[] = [
  { id: 'm1', name: 'Masala Dosa', price: 50, category: 'South Indian', inStock: true, stockCount: 15 },
  { id: 'm2', name: 'Veg Burger', price: 70, category: 'Fast Food', inStock: true, stockCount: 8 },
  { id: 'm3', name: 'Cold Coffee', price: 40, category: 'Beverages', inStock: true, stockCount: 20 },
  { id: 'm4', name: 'Samosa (2pcs)', price: 20, category: 'Snacks', inStock: false, stockCount: 0 },
  { id: 'm5', name: 'Paneer Sandwich', price: 60, category: 'Fast Food', inStock: true, stockCount: 5 },
  { id: 'm6', name: 'Chai', price: 15, category: 'Beverages', inStock: true, stockCount: 30 },
];

const StudentDashboard: React.FC<{ onOrder: (o: Order) => void; userName: string }> = ({ onOrder, userName }) => {
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
        studentName: userName
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
          <div
            key={item.id}
            className={`bg-slate-900 border p-4 rounded-2xl flex justify-between items-center transition-all ${item.inStock
                ? 'border-slate-800 hover:border-orange-500/50'
                : 'border-slate-800/50 opacity-60'
              }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg">{item.name}</h4>
                {item.inStock ? (
                  <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                    ✗ Out of Stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">{item.category} • ₹{item.price}</span>
                {item.inStock && item.stockCount !== undefined && (
                  <span className={`text-xs ${item.stockCount <= 5 ? 'text-orange-400' : 'text-slate-500'
                    }`}>
                    {item.stockCount <= 5 && '⚠️ '}Only {item.stockCount} left
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCart(p => ({ ...p, [item.id]: Math.max(0, (p[item.id] || 0) - 1) }))}
                disabled={!item.inStock}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >-</button>
              <span className="w-4 text-center">{cart[item.id] || 0}</span>
              <button
                onClick={() => {
                  const currentCount = cart[item.id] || 0;
                  if (item.stockCount && currentCount >= item.stockCount) {
                    alert(`Only ${item.stockCount} ${item.name} available!`);
                    return;
                  }
                  setCart(p => ({ ...p, [item.id]: currentCount + 1 }));
                }}
                disabled={!item.inStock}
                className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >+</button>
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
