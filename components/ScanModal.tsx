
import React, { useState, useEffect } from 'react';
import { X, Smartphone, Wifi, CheckCircle2 } from 'lucide-react';
import { NFCCard } from '../types';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardDetected: (card: NFCCard) => void;
}

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, onCardDetected }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'detected' | 'error'>('idle');
  const [detectedData, setDetectedData] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formFloors, setFormFloors] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setDetectedData(null);
      setFormName('');
      setFormFloors('');
      return;
    }

    const startNfc = async () => {
      setStatus('scanning');
      
      if ('NDEFReader' in window) {
        try {
          const reader = new (window as any).NDEFReader();
          await reader.scan();
          
          reader.addEventListener("reading", ({ serialNumber, message }: any) => {
            setDetectedData(serialNumber || "UID-" + Math.random().toString(16).slice(2, 10).toUpperCase());
            setStatus('detected');
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          });

          reader.addEventListener("readingerror", () => {
            console.error("Kart okunamadı. Lütfen tekrar deneyin.");
          });

        } catch (error) {
          console.error("NFC Hatası:", error);
          simulateScan(); // Geliştirme/Simülasyon için
        }
      } else {
        simulateScan();
      }
    };

    const simulateScan = () => {
      setTimeout(() => {
        setDetectedData("UID-" + Math.floor(Math.random() * 1000000).toString(16).toUpperCase());
        setStatus('detected');
      }, 2500);
    };

    startNfc();
  }, [isOpen]);

  const handleSave = () => {
    if (!detectedData) return;
    
    const floors = formFloors.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    
    const newCard: NFCCard = {
      id: crypto.randomUUID(),
      name: formName || 'Asansör Kartı',
      serialNumber: detectedData,
      floors: floors.length > 0 ? floors : [1],
      createdAt: Date.now(),
      type: 'new'
    };
    
    onCardDetected(newCard);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm glass rounded-[32px] overflow-hidden shadow-2xl border-slate-700/50">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-12 flex flex-col items-center">
          {status === 'scanning' ? (
            <>
              <div className="relative w-48 h-48 mb-10">
                <div className="nfc-ring"></div>
                <div className="nfc-ring" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <Smartphone className="text-blue-500" size={48} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2 text-center">Taranıyor...</h2>
              <p className="text-sm text-slate-400 text-center mb-6 px-4">
                Fiziksel kartınızı telefonun üst/arka kısmına yaklaştırın.
              </p>
              <div className="flex items-center gap-2 text-blue-400 animate-pulse text-[10px] font-bold uppercase tracking-widest">
                <Wifi size={14} className="rotate-90" />
                NFC SENSÖRÜ AKTİF
              </div>
            </>
          ) : (
            <div className="w-full space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-xl font-bold mb-1 text-center">Kart Algılandı!</h2>
                <p className="text-[10px] text-slate-500 font-mono mb-6 bg-slate-800 px-3 py-1 rounded-full">{detectedData}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 px-1">Kart Adı</label>
                  <input 
                    type="text" 
                    placeholder="Örn: Ofis Eski Kart" 
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 px-1">Açtığı Katlar (Virgülle ayırın)</label>
                  <input 
                    type="text" 
                    placeholder="Örn: 1, 3, 5, 8" 
                    value={formFloors}
                    onChange={e => setFormFloors(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Cüzdana Kaydet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanModal;
