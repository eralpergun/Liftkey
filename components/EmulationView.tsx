
import React, { useEffect, useState } from 'react';
import { X, Radio, Wifi, ShieldCheck, Check } from 'lucide-react';
import { NFCCard } from '../types';

interface EmulationViewProps {
  card: NFCCard | null;
  onClose: () => void;
}

const EmulationView: React.FC<EmulationViewProps> = ({ card, onClose }) => {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (card) {
      setSuccess(false);
      // Haptic feedback simülasyonu
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      
      const timer = setTimeout(() => {
        setSuccess(true);
        if (navigator.vibrate) navigator.vibrate(200);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [card]);

  if (!card) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md h-[80vh] bg-slate-900 rounded-t-[40px] border-t border-slate-700/50 p-8 flex flex-col items-center relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white rounded-full bg-slate-800"
        >
          <X size={20} />
        </button>

        <div className="mt-8 mb-12 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold mb-2">{card.name}</h2>
          <p className="text-slate-400 text-sm">Okuyucuya yaklaştırın</p>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          {/* Sinyal Dalgaları */}
          {!success && (
            <>
              <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-4 border-2 border-blue-500/20 rounded-full animate-ping [animation-delay:0.5s]"></div>
              <div className="absolute inset-8 border-2 border-blue-500/10 rounded-full animate-ping [animation-delay:1s]"></div>
            </>
          )}

          <div className={`w-40 h-40 rounded-3xl flex items-center justify-center transition-all duration-500 ${
            success ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 'bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)]'
          }`}>
            {success ? (
              <Check size={64} className="text-white animate-in zoom-in duration-300" />
            ) : (
              <Radio size={64} className="text-white animate-pulse" />
            )}
          </div>
        </div>

        <div className="w-full glass rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Kart Kimliği</span>
            <span className="text-xs font-mono text-blue-400">{card.serialNumber}</span>
          </div>
          <div className="flex gap-2">
            {card.floors.map(f => (
              <div key={f} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700">
                {f}
              </div>
            ))}
          </div>
        </div>

        {success && (
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all active:scale-95"
          >
            Tamam
          </button>
        )}
      </div>
    </div>
  );
};

export default EmulationView;
