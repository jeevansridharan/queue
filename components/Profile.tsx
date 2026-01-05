import React, { useState } from 'react';
import { User, UserRole, Order } from '../types';

interface ProfileProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
    orders: Order[];
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, orders }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const handleSave = () => {
        onUpdateUser({
            ...user,
            name: formData.name,
            email: formData.email,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user.name,
            email: user.email,
        });
        setIsEditing(false);
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'student':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'canteen':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'xerox':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'student':
                return '🎓';
            case 'canteen':
                return '🍔';
            case 'xerox':
                return '📄';
        }
    };


    const getJoinDate = () => {
        // Simulated join date - in a real app, this would come from the user object
        return new Date(2024, 0, 15).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Calculate dynamic stats from orders
    const userOrders = orders.filter(o => o.studentName === user.name);
    const totalOrders = userOrders.length;
    const activeOrders = userOrders.filter(o => o.status !== 'completed').length;
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);


    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold">My Profile</h2>
                <p className="text-slate-400">Manage your account information</p>
            </header>

            {/* Profile Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Header Section with Gradient */}
                <div className="bg-gradient-to-r from-orange-600/20 via-orange-500/10 to-transparent p-8 border-b border-slate-800">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl font-bold shadow-lg shadow-orange-600/30">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                                <span className="text-xs">✓</span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-bold">{user.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getRoleBadgeColor(user.role)}`}>
                                    {getRoleIcon(user.role)} {user.role}
                                </span>
                            </div>
                            <p className="text-slate-400 mb-4">{user.email}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>📅</span>
                                <span>Member since {getJoinDate()}</span>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium transition-all"
                            >
                                ✏️ Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-8">
                    {isEditing ? (
                        // Edit Mode
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Role
                                </label>
                                <div className="px-4 py-3 bg-slate-800/30 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed">
                                    {user.role} (Cannot be changed)
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-orange-600 hover:bg-orange-500 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20"
                                >
                                    💾 Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 rounded-xl font-bold transition-all"
                                >
                                    ✖️ Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        // View Mode
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Account Stats */}
                                <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">📊</span>
                                        <h4 className="font-bold text-slate-300">Account Stats</h4>
                                    </div>
                                    <div className="space-y-3 mt-4">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Total Orders</span>
                                            <span className="font-bold text-orange-400">{totalOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Active Orders</span>
                                            <span className="font-bold text-green-400">{activeOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Total Spent</span>
                                            <span className="font-bold text-blue-400">₹{totalSpent}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">⚡</span>
                                        <h4 className="font-bold text-slate-300">Quick Actions</h4>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <button className="w-full text-left px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-sm transition-all">
                                            🔔 Notification Settings
                                        </button>
                                        <button className="w-full text-left px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-sm transition-all">
                                            🔒 Change Password
                                        </button>
                                        <button className="w-full text-left px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-sm transition-all">
                                            📱 Connected Devices
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">⚙️</span>
                                    <h4 className="font-bold text-slate-300">Preferences</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-xs text-slate-500">Receive updates about your orders</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Push Notifications</p>
                                            <p className="text-xs text-slate-500">Get notified when order is ready</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Order History - Only for Students */}
                            {user.role === 'student' && (
                                <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🧾</span>
                                            <h4 className="font-bold text-slate-300">Order History & Receipts</h4>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            {orders.filter(o => o.studentName === user.name).length} orders
                                        </span>
                                    </div>

                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {orders
                                            .filter(o => o.studentName === user.name)
                                            .sort((a, b) => b.timestamp - a.timestamp)
                                            .map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-orange-500/30 transition-all"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.type === 'canteen'
                                                                    ? 'bg-orange-500/20 text-orange-400'
                                                                    : 'bg-blue-500/20 text-blue-400'
                                                                    }`}>
                                                                    {order.type === 'canteen' ? '🍔 Canteen' : '📄 Xerox'}
                                                                </span>
                                                                <span className="text-xs text-slate-500 font-mono">#{order.id}</span>
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                                    order.status === 'ready' ? 'bg-blue-500/20 text-blue-400' :
                                                                        order.status === 'preparing' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                            'bg-slate-500/20 text-slate-400'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm font-medium text-slate-200">{order.items}</p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                {new Date(order.timestamp).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-orange-400">₹{order.total}</div>
                                                            <button
                                                                onClick={() => {
                                                                    // Generate receipt
                                                                    const receipt = `
RushX - Smart Campus
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECEIPT #${order.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Customer: ${order.studentName}
Type: ${order.type.toUpperCase()}
Date: ${new Date(order.timestamp).toLocaleString()}

Items:
${order.items}

Pickup Slot: ${order.pickupSlot}
Status: ${order.status.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ₹${order.total}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for using RushX!
                                                `.trim();

                                                                    // Download as text file
                                                                    const blob = new Blob([receipt], { type: 'text/plain' });
                                                                    const url = URL.createObjectURL(blob);
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    a.download = `RushX_Receipt_${order.id}.txt`;
                                                                    document.body.appendChild(a);
                                                                    a.click();
                                                                    document.body.removeChild(a);
                                                                    URL.revokeObjectURL(url);
                                                                }}
                                                                className="text-xs text-orange-400 hover:text-orange-300 underline mt-1"
                                                            >
                                                                📥 Download Receipt
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Receipt Preview */}
                                                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div>
                                                                <span className="text-slate-500">Pickup:</span>
                                                                <span className="ml-2 text-slate-300">{order.pickupSlot}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-slate-500">Payment:</span>
                                                                <span className="ml-2 text-green-400">✓ Paid</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        {orders.filter(o => o.studentName === user.name).length === 0 && (
                                            <div className="text-center py-8 text-slate-500">
                                                <div className="text-4xl mb-2">📦</div>
                                                <p>No orders yet</p>
                                                <p className="text-xs mt-1">Your order history will appear here</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
