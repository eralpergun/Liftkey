
import React, { useState, useEffect } from 'react';
import { X, Smartphone, Wifi, CheckCircle2, AlertTriangle, Keyboard, Fingerprint, ExternalLink, HelpCircle, Copy } from 'lucide-react';
import { NFCCard } from '../types';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardDetected: (card: NFCCard) => void;
}

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, onCardDetected }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'detected' | 'error' | 'manual' | 'ios-help'>('idle');
  const [detectedData, setDetectedData] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formFloors, setFormFloors] = useState('');
  const [manualUID, setManualUID] = useState('');

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uidFromUrl = params.get('uid');
    
    if (isOpen && uidFromUrl) {
      setDetectedData(uidFromUrl);
      setStatus('detected');
    } else if (isOpen) {
      if (isIOS) setStatus('ios-help');
      else startNfc();
    } else {
      setStatus('idle');
    }
  }, [isOpen]);

  const startNfc = async () => {
    if (!('NDEFReader' in window)) {
      setStatus('manual');
      return;
    }
    try {
      setStatus('scanning');
      const reader = new (window as any).NDEFReader();
      await reader.scan();
      reader.addEventListener("reading", ({ serialNumber }: any) => {
        setDetectedData(serialNumber || "04:XX:XX:XX");
        setStatus('detected');
        if (navigator.vibrate) navigator.vibrate(200);
      });
    } catch (e) {
      setStatus('manual');
    }
  };

  const handleSave = () => {
    const finalUID = detectedData || manualUID;
    if (!finalUID) return;
    const floors = formFloors.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    onCardDetected({
      id: crypto.randomUUID(),
      name: formName || 'Yeni Kart',
      serialNumber: finalUID,
      floors: floors.length > 0 ? floors : [0],
      createdAt: Date.now(),
      type: 'new'
    });
    onClose();
  };

  const copyShortcutUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}?uid=`;
    navigator.clipboard.writeText(url);
    alert("Köprü URL kopyalandı! Kestirmeler uygulamasında 'URL' kısmına yapıştırın.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="relative w-full max-w-sm glass rounded-[44px] overflow-hidden shadow-2xl border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 bg-slate-800/50 rounded-full"><X size={20}/></button>

        <div className="p-8 pt-12 flex flex-col items-center">
          {status === 'ios-help' && (
            <div className="space-y-6 w-full animate-in zoom-in duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle size={32} />
                </div>
                <h2 className="text-xl font-black mb-2 uppercase">iOS NFC KÖPRÜSÜ</h2>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tighter">
                  Apple, Safari'nin doğrudan NFC okumasına izin vermez. Veriyi aktarmak için "Kestirmeler" köprüsü kurmalısınız.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-blue-400 mb-1 uppercase tracking-widest">Adım 1</p>
                  <p className="text-xs text-slate-300">Kestirmeler uygulamasını açın ve "NFC Otomasyonu" oluşturun.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-blue-400 mb-1 uppercase tracking-widest">Adım 2</p>
                  <p className="text-xs text-slate-300">Eylem olarak "URL Aç" seçin ve aşağıdaki linki yapıştırın.</p>
                </div>
              </div>

              <button 
                onClick={copyShortcutUrl}
                className="w-full bg-slate-800 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all"
              >
                <Copy size={16} /> KÖPRÜ URL'SİNİ KOPYALA
              </button>

              <button 
                onClick={() => setStatus('manual')}
                className="w-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] py-2"
              >
                Veya Manuel Giriş Yap
              </button>
            </div>
          )}

          {status === 'scanning' && (
             <>
              <div className="relative w-48 h-48 mb-10">
                <div className="nfc-ring"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="text-blue-500 animate-bounce" size={48} />
                </div>
              </div>
              <h2 className="text-xl font-black mb-2 uppercase">OKUMA MODU</h2>
              <p className="text-xs text-slate-400 text-center">Kartı telefonun arkasına dokundurun...</p>
            </>
          )}

          {(status === 'manual' || status === 'detected') && (
            <div className="w-full space-y-4 animate-in fade-in duration-500">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                  {status === 'detected' ? <CheckCircle2 size={32} /> : <Keyboard size={32} />}
                </div>
                <h2 className="text-xl font-black uppercase">{status === 'detected' ? 'KART HAZIR' : 'MANUEL GİRİŞ'}</h2>
              </div>

              <div className="space-y-3">
                <input 
                  type="text" placeholder="Kart UID (Örn: 04:A1:B2...)" 
                  value={detectedData || manualUID} onChange={e => setManualUID(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm uppercase text-blue-400"
                />
                <input 
                  type="text" placeholder="Kart İsmi" 
                  value={formName} onChange={e => setFormName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                />
                <input 
                  type="text" placeholder="Katlar (Örn: 1, 3, 5)" 
                  value={formFloors} onChange={e => setFormFloors(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                />
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4"
              >
                KAYDET VE KASAYA EKLE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanModal;
