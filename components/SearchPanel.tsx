
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface SearchResult {
  text: string;
  sources: { uri: string; title: string }[];
}

const SearchPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const sources: { uri: string; title: string }[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });

      setResult({
        text: response.text || '',
        sources: sources,
      });
    } catch (error) {
      console.error(error);
      alert('Search failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Smart Knowledge Search</h2>
        <p className="text-slate-400">Ask complex questions and get grounded answers with live web data.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-12 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are the latest breakthroughs in fusion energy?"
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-blue-500/50 outline-none shadow-xl"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          {isLoading ? '⏳' : '🔍'}
        </button>
      </form>

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          <div className="h-20 bg-slate-900 rounded-xl mt-8 border border-slate-800"></div>
        </div>
      )}

      {result && (
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-wrap">{result.text}</p>
          </div>

          {result.sources.length > 0 && (
            <div className="border-t border-slate-800 pt-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Verified Sources</h3>
              <div className="flex flex-wrap gap-3">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 px-4 py-2 rounded-xl text-sm text-slate-300 transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-blue-400">🔗</span>
                    <span className="truncate max-w-[200px]">{src.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
