
import React, { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle2, Keyboard, HelpCircle, Copy, Info } from 'lucide-react';
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
    // URL parametrelerini kontrol et
    const checkUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const uidFromUrl = params.get('uid');
      if (uidFromUrl && isOpen) {
        setDetectedData(uidFromUrl);
        setStatus('detected');
        // URL'yi temizle (PWA'da tekrar açıldığında aynı kartı eklemesin)
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    if (isOpen) {
      checkUrlParams();
      if (!detectedData) {
        if (isIOS) setStatus('ios-help');
        else startNfc();
      }
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
        setDetectedData(serialNumber);
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
    setDetectedData(null);
    setManualUID('');
    setFormName('');
    setFormFloors('');
  };

  const copyShortcutUrl = () => {
    // Vercel linkini mutlak olarak oluştur
    const baseUrl = "https://liftkey.vercel.app/";
    const url = `${baseUrl}?uid=`;
    navigator.clipboard.writeText(url);
    alert("URL kopyalandı! Kestirmeler uygulamasındaki URL alanına yapıştırın.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="relative w-full max-w-sm glass rounded-[44px] overflow-hidden shadow-2xl border-white/10 animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 bg-slate-800/50 rounded-full"><X size={20}/></button>

        <div className="p-8 pt-12 flex flex-col items-center">
          {status === 'ios-help' && (
            <div className="space-y-6 w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle size={32} />
                </div>
                <h2 className="text-xl font-black mb-2 uppercase italic tracking-tighter">IPHONE KÖPRÜSÜ</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  Apple kısıtlamalarını aşmak için Kestirmeler uygulamasını kullanmalısınız.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                  <p className="text-[11px] text-slate-300"><b>Kestirmeler</b> uygulamasını açın.</p>
                </div>
                <div className="flex gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-[10px] font-black flex items-center justify-center shrink-0">2</span>
                  <p className="text-[11px] text-slate-300">NFC okunduğunda <b>URL Aç</b> eylemiyle aşağıdaki linki çağırın.</p>
                </div>
              </div>

              <button 
                onClick={copyShortcutUrl}
                className="w-full bg-blue-600 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Copy size={16} /> KÖPRÜ LİNKİNİ KOPYALA
              </button>

              <button 
                onClick={() => setStatus('manual')}
                className="w-full text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] py-2"
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
            <div className="w-full space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                  {status === 'detected' ? <CheckCircle2 size={32} /> : <Keyboard size={32} />}
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter italic">{status === 'detected' ? 'KART HAZIR' : 'BİLGİ GİRİŞİ'}</h2>
              </div>

              <div className="space-y-3">
                <div className="group">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-1 block">KİMLİK (UID)</label>
                  <input 
                    type="text" placeholder="Örn: 04:A1:B2..." 
                    value={detectedData || manualUID} onChange={e => setManualUID(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none font-mono text-sm uppercase text-blue-400 focus:border-blue-500 transition-all shadow-inner"
                  />
                </div>
                <div className="group">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-1 block">ETİKET</label>
                  <input 
                    type="text" placeholder="Örn: Ofis Kartı" 
                    value={formName} onChange={e => setFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none text-sm font-bold focus:border-blue-500 transition-all shadow-inner"
                  />
                </div>
                <div className="group">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-1 block">KAT NUMARALARI</label>
                  <input 
                    type="text" placeholder="Örn: 1, 3, 5" 
                    value={formFloors} onChange={e => setFormFloors(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none text-sm font-bold focus:border-blue-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4 italic tracking-widest"
              >
                SİSTEME KAYDET
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanModal;
