import React, { useState } from 'react';
import { MenuItem } from '../types';

interface StockManagerProps {
    initialMenu: MenuItem[];
    onUpdateStock: (updatedMenu: MenuItem[]) => void;
}

const StockManager: React.FC<StockManagerProps> = ({ initialMenu, onUpdateStock }) => {
    const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
    const [editingId, setEditingId] = useState<string | null>(null);

    const updateStock = (id: string, stockCount: number, inStock: boolean) => {
        const updatedMenu = menu.map(item =>
            item.id === id ? { ...item, stockCount, inStock } : item
        );
        setMenu(updatedMenu);
        onUpdateStock(updatedMenu);
    };

    const toggleStock = (id: string) => {
        const item = menu.find(m => m.id === id);
        if (!item) return;

        const newInStock = !item.inStock;
        updateStock(id, newInStock ? (item.stockCount || 0) : 0, newInStock);
    };

    const incrementStock = (id: string, amount: number) => {
        const item = menu.find(m => m.id === id);
        if (!item) return;

        const newCount = Math.max(0, (item.stockCount || 0) + amount);
        updateStock(id, newCount, newCount > 0);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <header className="mb-8">
                <h2 className="text-3xl font-bold">📦 Stock Management</h2>
                <p className="text-slate-400">Manage your canteen inventory in real-time</p>
            </header>

            <div className="grid gap-4">
                {menu.map(item => (
                    <div
                        key={item.id}
                        className={`bg-slate-900 border rounded-2xl p-5 transition-all ${item.inStock ? 'border-slate-800' : 'border-red-500/30 bg-red-500/5'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                                <p className="text-sm text-slate-500">{item.category} • ₹{item.price}</p>
                            </div>

                            <button
                                onClick={() => toggleStock(item.id)}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${item.inStock
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                    }`}
                            >
                                {item.inStock ? '✓ Available' : '✗ Unavailable'}
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-slate-500 mb-2 block">Stock Count</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => incrementStock(item.id, -5)}
                                        className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold transition-all"
                                    >
                                        -5
                                    </button>
                                    <button
                                        onClick={() => incrementStock(item.id, -1)}
                                        className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold transition-all"
                                    >
                                        -1
                                    </button>

                                    <div className="flex-1 text-center">
                                        <div className={`text-3xl font-bold ${(item.stockCount || 0) <= 5 ? 'text-orange-400' : 'text-white'
                                            }`}>
                                            {item.stockCount || 0}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">units</div>
                                    </div>

                                    <button
                                        onClick={() => incrementStock(item.id, 1)}
                                        className="w-10 h-10 rounded-lg bg-orange-600 hover:bg-orange-500 flex items-center justify-center font-bold transition-all"
                                    >
                                        +1
                                    </button>
                                    <button
                                        onClick={() => incrementStock(item.id, 5)}
                                        className="w-10 h-10 rounded-lg bg-orange-600 hover:bg-orange-500 flex items-center justify-center font-bold transition-all"
                                    >
                                        +5
                                    </button>
                                </div>
                            </div>

                            {(item.stockCount || 0) <= 5 && item.inStock && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                    <span className="text-2xl">⚠️</span>
                                    <span className="text-sm text-orange-400 font-semibold">Low Stock Alert</span>
                                </div>
                            )}
                        </div>

                        {!item.inStock && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-400">
                                    ⚠️ This item is marked as unavailable and won't appear in the student menu
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Stock Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                        <div className="text-2xl font-bold text-green-400">{menu.filter(m => m.inStock).length}</div>
                        <div className="text-xs text-slate-500">Items Available</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                        <div className="text-2xl font-bold text-red-400">{menu.filter(m => !m.inStock).length}</div>
                        <div className="text-xs text-slate-500">Out of Stock</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                        <div className="text-2xl font-bold text-orange-400">
                            {menu.filter(m => m.inStock && (m.stockCount || 0) <= 5).length}
                        </div>
                        <div className="text-xs text-slate-500">Low Stock Items</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-400">
                            {menu.reduce((sum, m) => sum + (m.stockCount || 0), 0)}
                        </div>
                        <div className="text-xs text-slate-500">Total Units</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockManager;
