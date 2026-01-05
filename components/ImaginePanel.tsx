
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GeneratedImage } from '../types';

const ImaginePanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImagine = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          const newImg: GeneratedImage = {
            id: Date.now().toString(),
            url: imageUrl,
            prompt: prompt,
            timestamp: Date.now()
          };
          setImages(prev => [newImg, ...prev]);
          foundImage = true;
          setPrompt('');
          break;
        }
      }
      
      if (!foundImage) {
        alert("Model didn't return an image part. It might have returned text instead.");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating image. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Unleash Your Imagination</h2>
        <p className="text-slate-400">Transform your words into stunning visual art with Gemini's vision engine.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <div className="flex gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city with floating gardens and holographic rain..."
            className="flex-1 bg-transparent border-none px-4 py-2 focus:ring-0 text-slate-100 placeholder:text-slate-600"
          />
          <button
            onClick={handleImagine}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold px-6 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            {isGenerating ? 'Synthesizing...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isGenerating && (
          <div className="aspect-square bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center animate-pulse">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-slate-500 text-sm">Brewing magic...</p>
            </div>
          </div>
        )}
        {images.map(img => (
          <div key={img.id} className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 transition-transform hover:scale-[1.02] duration-300">
            <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
              <p className="text-sm text-slate-200 line-clamp-2 italic">"{img.prompt}"</p>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = img.url;
                  link.download = `nexus-gen-${img.id}.png`;
                  link.click();
                }}
                className="mt-4 text-xs bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg w-fit transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !isGenerating && (
        <div className="text-center py-20 opacity-30">
          <div className="text-6xl mb-6">🎨</div>
          <p className="text-xl">Your creative gallery is empty. Start generating!</p>
        </div>
      )}
    </div>
  );
};

export default ImaginePanel;
