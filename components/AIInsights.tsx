
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Order } from '../types';

const AIInsights: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Calculate real-time metrics
  const calculateMetrics = () => {
    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);

    // Filter today's orders
    const todayOrders = orders.filter(o => o.timestamp >= today);

    // Active orders (pending or preparing)
    const activeOrders = orders.filter(o =>
      o.status === 'pending' || o.status === 'preparing'
    );

    // Calculate load level
    const maxCapacity = 10;
    const loadPercentage = (activeOrders.length / maxCapacity) * 100;
    const loadLevel =
      loadPercentage <= 30 ? 'Low' :
        loadPercentage <= 60 ? 'Moderate' :
          loadPercentage <= 85 ? 'High' : 'Critical';

    const loadColor =
      loadPercentage <= 30 ? 'text-green-400' :
        loadPercentage <= 60 ? 'text-yellow-400' :
          loadPercentage <= 85 ? 'text-orange-400' : 'text-red-400';

    // Calculate wait time
    const avgProcessingTime = 8; // minutes per order
    const estimatedWait = Math.max(5, activeOrders.length * avgProcessingTime);

    // Calculate efficiency
    const completedOrders = todayOrders.filter(o => o.status === 'completed');
    const efficiency = todayOrders.length > 0
      ? Math.round((completedOrders.length / todayOrders.length) * 100)
      : 0;

    // Predict next rush hour
    const currentHour = new Date().getHours();
    const nextRush = predictNextRush(currentHour);

    // Calculate confidence based on order patterns
    const recentOrders = orders.filter(o => o.timestamp > now - 3600000); // Last hour
    const confidence = Math.min(95, 70 + recentOrders.length * 3);

    // Calculate orders by type
    const canteenOrders = todayOrders.filter(o => o.type === 'canteen');
    const xeroxOrders = todayOrders.filter(o => o.type === 'xerox');

    return {
      loadLevel,
      loadColor,
      loadPercentage: Math.round(loadPercentage),
      estimatedWait,
      efficiency,
      nextRush,
      confidence,
      activeCount: activeOrders.length,
      completedToday: completedOrders.length,
      totalToday: todayOrders.length,
      canteenCount: canteenOrders.length,
      xeroxCount: xeroxOrders.length
    };
  };

  const predictNextRush = (currentHour: number): string => {
    // Peak times for campus canteen/xerox
    const peakTimes = [
      { hour: 9, label: '09:00 AM', type: 'Breakfast Rush' },
      { hour: 13, label: '01:00 PM', type: 'Lunch Rush' },
      { hour: 17, label: '05:00 PM', type: 'Evening Snacks' }
    ];

    // Find next peak time
    for (const peak of peakTimes) {
      if (currentHour < peak.hour) {
        return peak.label;
      }
    }

    // If past all peaks, return tomorrow's first peak
    return '09:00 AM (Tomorrow)';
  };

  const getPrediction = async () => {
    setLoading(true);
    const metrics = calculateMetrics();

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const prompt = `
        Context: You are the AI manager for RushX Campus. 
        
        Current Data:
        - Active Orders: ${metrics.activeCount}
        - Completed Today: ${metrics.completedToday}/${metrics.totalToday}
        - Current Load: ${metrics.loadLevel} (${metrics.loadPercentage}%)
        - Efficiency: ${metrics.efficiency}%
        - Next Predicted Rush: ${metrics.nextRush}
        
        System Stats: Peak lunch hour is 12:00 PM to 2:00 PM. Xerox shop gets busy 1 hour before exams.
        
        Task: 
        1. Analyze the current situation and predict the next peak rush hour
        2. Suggest the best "Express Pickup" slot for a student ordering now
        3. Provide one actionable "Vendor Tip" to handle the predicted rush
        
        Keep it concise (3-4 sentences max), use emojis, and format with bold titles.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setPrediction(response.text || 'Unable to generate prediction.');
    } catch (err) {
      setPrediction('AI Analysis currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getPrediction(); }, [orders.length]);

  const metrics = calculateMetrics();

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span className="text-orange-500">✨</span> RushX Intelligence
        </h2>
        <p className="text-slate-400">Real-time predictive analysis for smart pickup slots and vendor efficiency.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-orange-500 text-sm font-bold uppercase mb-2 text-[10px]">Current Load</div>
          <div className={`text-4xl font-bold ${metrics.loadColor}`}>{metrics.loadLevel}</div>
          <p className="text-xs text-slate-500 mt-2">
            {metrics.activeCount} active orders • ~{metrics.estimatedWait} mins wait
          </p>
          <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${metrics.loadPercentage <= 30 ? 'bg-green-500' :
                metrics.loadPercentage <= 60 ? 'bg-yellow-500' :
                  metrics.loadPercentage <= 85 ? 'bg-orange-500' : 'bg-red-500'
                }`}
              style={{ width: `${Math.min(100, metrics.loadPercentage)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-indigo-500 text-sm font-bold uppercase mb-2 text-[10px]">Next Rush</div>
          <div className="text-4xl font-bold">{metrics.nextRush}</div>
          <p className="text-xs text-slate-500 mt-2">Confidence: {metrics.confidence}%</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>📊</span>
            <span>Based on historical patterns</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-green-500 text-sm font-bold uppercase mb-2 text-[10px]">Daily Efficiency</div>
          <div className="text-4xl font-bold">{metrics.efficiency}%</div>
          <p className="text-xs text-slate-500 mt-2">
            {metrics.completedToday}/{metrics.totalToday} orders completed
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className={metrics.efficiency >= 80 ? 'text-green-400' : 'text-orange-400'}>
              {metrics.efficiency >= 80 ? '↑ Excellent' : '→ Good'}
            </span>
          </div>
        </div>
      </div>

      {/* Order Breakdown by Type */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📊</span>
          Today's Orders Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl">
                🍔
              </div>
              <div>
                <div className="text-sm text-slate-400 uppercase font-bold">Canteen Orders</div>
                <div className="text-3xl font-bold text-orange-400">{metrics.canteenCount}</div>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              {metrics.totalToday > 0
                ? `${Math.round((metrics.canteenCount / metrics.totalToday) * 100)}%`
                : '0%'
              }
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                📄
              </div>
              <div>
                <div className="text-sm text-slate-400 uppercase font-bold">Xerox Orders</div>
                <div className="text-3xl font-bold text-blue-400">{metrics.xeroxCount}</div>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              {metrics.totalToday > 0
                ? `${Math.round((metrics.xeroxCount / metrics.totalToday) * 100)}%`
                : '0%'
              }
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl pointer-events-none">🤖</div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          RushX AI Forecast
          {loading && <span className="animate-spin text-sm">⏳</span>}
        </h3>
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse"></div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
            {prediction}
          </div>
        )}
        <button
          onClick={getPrediction}
          className="mt-6 text-sm text-orange-400 hover:text-orange-300 font-bold underline transition-colors">
          Refresh Live Analysis
        </button>
      </div>
    </div>
  );
};

export default AIInsights;
