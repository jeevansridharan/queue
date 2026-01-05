import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student' as UserRole
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const user: User = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };
            onLogin(user);
            setIsLoading(false);
        }, 1000);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-950 to-slate-950">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-orange-600/30">
                            R
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">RushX</h1>
                    </div>
                    <p className="text-slate-400 text-sm">Smart Campus Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-slate-400 text-sm mb-6">Sign in to access your dashboard</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.name ? 'border-red-500' : 'border-slate-700'
                                    } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                    <span>⚠</span> {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.email ? 'border-red-500' : 'border-slate-700'
                                    } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                    <span>⚠</span> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className={`w-full px-4 py-3 bg-slate-800/50 border ${errors.password ? 'border-red-500' : 'border-slate-700'
                                        } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                    <span>⚠</span> {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                I am a...
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['student', 'canteen', 'xerox'] as UserRole[]).map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => handleChange('role', role)}
                                        className={`px-4 py-3 rounded-xl font-medium text-sm capitalize transition-all ${formData.role === role
                                                ? 'bg-orange-600 text-white border-2 border-orange-500 shadow-lg shadow-orange-600/20'
                                                : 'bg-slate-800/50 text-slate-400 border-2 border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        {role === 'student' && '🎓'}
                                        {role === 'canteen' && '🍔'}
                                        {role === 'xerox' && '📄'}
                                        <div className="mt-1">{role}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 py-4 rounded-xl font-bold text-lg hover:from-orange-500 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <p className="text-xs text-center text-slate-500">
                            Demo Mode • No real authentication required
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    Secure • Fast • Reliable
                </p>
            </div>
        </div>
    );
};

export default Login;
