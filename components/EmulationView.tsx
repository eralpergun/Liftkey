
import React, { useEffect, useState } from 'react';
import { X, Radio, Wifi, ShieldCheck, Check, Copy, Zap, Info, AlertCircle, Share2, ArrowRightLeft } from 'lucide-react';
import { NFCCard } from '../types';

interface EmulationViewProps {
  card: NFCCard | null;
  onClose: () => void;
}

const EmulationView: React.FC<EmulationViewProps> = ({ card, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'writing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleWriteToTag = async () => {
    if (!card) return;
    
    if (!('NDEFReader' in window)) {
      setErrorMsg("Bu cihaz/tarayıcı fiziksel karta yazmayı desteklemiyor.");
      setStatus('error');
      return;
    }

    try {
      setStatus('writing');
      const reader = new (window as any).NDEFReader();
      
      // Çoğu asansör okuyucusu UID'ye bakar, ancak bazıları NDEF Text kaydı içindeki veriyi de okuyabilir.
      // Burada veriyi karta kalıcı olarak yazıyoruz.
      await reader.write({
        records: [
          { 
            recordType: "text", 
            data: `LIFTKEY_DATA:${card.serialNumber}|FLOORS:${card.floors.join(',')}` 
          }
        ]
      });
      
      setStatus('success');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      console.error("Yazma Hatası:", error);
      setErrorMsg(error.message || "Yazma başarısız.");
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const handleShareData = () => {
    if (!card) return;
    const shareText = `LIFTKEY KART VERİSİ:\nİsim: ${card.name}\nUID: ${card.serialNumber}\nKatlar: ${card.floors.join(', ')}\n\nBu metni kopyalayıp Android bir cihazdaki LiftKey uygulamasına yapıştırarak fiziksel karta yazdırabilirsiniz.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'LiftKey Kart Transferi',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Kart verileri panoya kopyalandı! Android bir cihaza gönderip yazdırabilirsiniz.");
    }
  };

  if (!card) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-md h-[90vh] bg-slate-900 rounded-t-[40px] border-t border-slate-700/50 p-6 flex flex-col items-center relative shadow-2xl overflow-y-auto">
        <div className="w-12 h-1 bg-slate-700 rounded-full mb-6 opacity-50 shrink-0"></div>
        
        <button onClick={onClose} className="absolute top-8 right-6 p-2.5 text-slate-500 hover:text-white rounded-full bg-slate-800">
          <X size={18} />
        </button>

        <div className="text-center mb-6 shrink-0">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black mb-2 uppercase tracking-widest ${card.type === 'merged' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {card.type === 'merged' ? 'BİRLEŞİK DİJİTAL ANAHTAR' : 'FİZİKSEL KART KOPYASI'}
          </span>
          <h2 className="text-3xl font-black mb-1">{card.name}</h2>
        </div>

        {/* Görsel Sinyal Alanı */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8 shrink-0">
          <div className={`absolute inset-0 border-2 rounded-full animate-[ping_3s_linear_infinite] ${status === 'writing' ? 'border-amber-500/30' : 'border-blue-500/10'}`}></div>
          <div className={`w-40 h-40 rounded-[40px] flex flex-col items-center justify-center transition-all duration-500 z-10 shadow-2xl ${
            status === 'success' ? 'bg-emerald-600 shadow-emerald-500/40' : 
            status === 'error' ? 'bg-red-600 shadow-red-500/40' : 
            status === 'writing' ? 'bg-amber-500 shadow-amber-500/40 animate-pulse' :
            'bg-blue-600 shadow-blue-500/40'
          }`}>
            {status === 'writing' ? (
              <Zap size={64} className="text-white animate-bounce" />
            ) : status === 'success' ? (
              <Check size={80} className="text-white scale-110" />
            ) : status === 'error' ? (
              <AlertCircle size={64} className="text-white" />
            ) : (
              <Radio size={80} className="text-white opacity-90" />
            )}
          </div>
          <p className="absolute -bottom-4 text-[10px] font-black text-slate-500 tracking-[0.2em]">
            {status === 'writing' ? 'KARTA YAZILIYOR...' : status === 'success' ? 'YAZMA BAŞARILI' : 'SİNYAL YAYINDA'}
          </p>
        </div>

        {/* Kart Detayları */}
        <div className="w-full glass rounded-3xl p-5 mb-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">KART UID SİNYALİ</p>
              <p className="text-xl font-mono text-blue-400 font-bold">{card.serialNumber}</p>
            </div>
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
              <ShieldCheck className="text-blue-500" size={24} />
            </div>
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">ERİŞİM YETKİSİ OLAN KATLAR</p>
            <div className="flex flex-wrap gap-2">
              {card.floors.map(f => (
                <div key={f} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-black border border-slate-700 text-slate-200 shadow-inner">
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="w-full flex flex-col gap-3 mt-auto shrink-0">
          {!isIOS ? (
            <button 
              onClick={handleWriteToTag}
              disabled={status === 'writing'}
              className="w-full bg-white text-slate-950 py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              <Copy size={20} />
              YENİ FİZİKSEL KARTA YAZ
            </button>
          ) : (
            <div className="space-y-3">
               <button 
                onClick={handleShareData}
                className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
              >
                <ArrowRightLeft size={20} />
                ANDROID'E AKTAR VE YAZDIR
              </button>
              <div className="flex items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <Info size={16} className="text-amber-500 shrink-0" />
                <p className="text-[9px] text-slate-400 leading-tight">
                  iPhone'lar doğrudan fiziksel karta veri yazamaz. Bu kartı fiziksel olarak kullanmak istiyorsanız "Android'e Aktar" butonu ile veriyi bir Android cihaza gönderip oradan boş bir karta yazdırın.
                </p>
              </div>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="w-full py-4 text-slate-500 font-bold text-xs uppercase tracking-widest"
          >
            Kapat
          </button>
        </div>

        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl w-full text-center">
            <p className="text-red-400 text-[10px] font-bold">{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmulationView;
