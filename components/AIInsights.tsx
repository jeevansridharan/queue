
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Order } from '../types';

const AIInsights: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getPrediction = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Context: You are the AI manager for RushX Campus. 
        Current Live Orders: ${orders.length}
        System Stats: Peak lunch hour is 12:00 PM to 2:00 PM. Xerox shop gets busy 1 hour before exams.
        
        Task: 
        1. Predict the next peak rush hour based on current activity.
        2. Suggest the best "Express Pickup" slot for a student ordering now.
        3. Provide one "Vendor Tip" to handle the predicted rush.
        Keep it concise, formatting with bold titles. Use emojis.
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

  useEffect(() => { getPrediction(); }, []);

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <span className="text-orange-500">✨</span> RushX Intelligence
        </h2>
        <p className="text-slate-400">Predictive analysis for smart pickup slots and vendor efficiency.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-orange-500 text-sm font-bold uppercase mb-2 text-[10px]">Current Load</div>
          <div className="text-4xl font-bold">Moderate</div>
          <p className="text-xs text-slate-500 mt-2">Estimated Wait: ~12 mins</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-indigo-500 text-sm font-bold uppercase mb-2 text-[10px]">Next Rush</div>
          <div className="text-4xl font-bold">01:15 PM</div>
          <p className="text-xs text-slate-500 mt-2">Confidence: 89%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="text-green-500 text-sm font-bold uppercase mb-2 text-[10px]">Daily Efficiency</div>
          <div className="text-4xl font-bold">94%</div>
          <p className="text-xs text-slate-500 mt-2">Up 4% from yesterday</p>
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
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-2/3"></div>
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
