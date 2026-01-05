
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, encode, decodeAudioData, createPcmBlob } from '../AudioUtils';

const LivePanel: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{ role: string, text: string }[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleSession = async () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Audio handling
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            // Interruption handling
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            // Transcription
            if (message.serverContent?.outputTranscription) {
              setCurrentTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            } else if (message.serverContent?.turnComplete) {
              setTranscriptions(prev => [...prev, { role: 'Assistant', text: currentTranscription }]);
              setCurrentTranscription('');
            }
          },
          onerror: (e) => console.error('Live API Error:', e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          outputAudioTranscription: {},
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Microphone permission required or API error.');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setTranscriptions([]);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Nexus Voice</h2>
        <p className="text-slate-400">Experience near-zero latency real-time voice conversations.</p>
      </div>

      <div className="relative mb-16">
        {isActive && (
          <>
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse scale-150"></div>
          </>
        )}
        <button
          onClick={toggleSession}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          <span className="text-4xl">{isActive ? '⏹️' : '🎙️'}</span>
        </button>
      </div>

      <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 min-h-[200px] flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Transcription</h3>
        <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto">
          {transcriptions.map((t, i) => (
            <div key={i} className="text-sm">
              <span className="font-bold text-indigo-400 mr-2">{t.role}:</span>
              <span className="text-slate-300">{t.text}</span>
            </div>
          ))}
          {currentTranscription && (
            <div className="text-sm">
              <span className="font-bold text-indigo-400 mr-2">Assistant:</span>
              <span className="text-slate-100">{currentTranscription}</span>
              <span className="inline-block w-1 h-4 bg-indigo-500 animate-pulse ml-1 align-middle"></span>
            </div>
          )}
          {!isActive && transcriptions.length === 0 && (
            <p className="text-slate-600 italic text-center py-10">Click the microphone to start talking...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePanel;
