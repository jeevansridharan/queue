
import React, { useState } from 'react';
import { Order } from '../types';

const XeroxModule: React.FC<{ onOrder: (o: Order) => void; userName: string }> = ({ onOrder, userName }) => {
  const [pages, setPages] = useState(1);
  const [isColor, setIsColor] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const price = pages * (isColor ? 5 : 2);

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file.");

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;

      onOrder({
        id: `X${Math.floor(Math.random() * 900)}`,
        type: 'xerox',
        items: `${file.name} (${pages} pgs, ${isColor ? 'Color' : 'B&W'})`,
        total: price,
        status: 'pending',
        pickupSlot: '15 mins from now',
        timestamp: Date.now(),
        studentName: userName,
        fileData: base64Data,
        fileName: file.name,
        fileSize: file.size
      });

      setFile(null);
      setPages(1);
      setIsColor(false);
      alert("Document uploaded! Pickup in 15 mins.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Smart Xerox</h2>
        <p className="text-slate-400">Upload PDFs, select options, and pick up when ready.</p>
      </header>

      <div className="max-w-xl bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">Upload Document (PDF)</label>
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-orange-500/50 transition-all cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="file-up"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="file-up" className="cursor-pointer">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-slate-200">{file ? file.name : 'Click to browse or drag and drop'}</p>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Pages</label>
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Mode</label>
            <div className="flex bg-slate-800 rounded-xl p-1">
              <button
                onClick={() => setIsColor(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${!isColor ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>B&W</button>
              <button
                onClick={() => setIsColor(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${isColor ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>Color</button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-800">
          <div>
            <span className="text-slate-500 text-sm">Calculated Cost</span>
            <div className="text-2xl font-bold">₹{price}</div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-orange-600 hover:bg-orange-500 px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20">
            Upload & Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default XeroxModule;
