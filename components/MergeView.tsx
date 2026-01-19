
import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, Zap, X, ShieldAlert } from 'lucide-react';
import { NFCCard } from '../types';

interface MergeViewProps {
  cards: NFCCard[];
  onMerge: (name: string, floors: number[]) => void;
  onCancel: () => void;
}

const MergeView: React.FC<MergeViewProps> = ({ cards, onMerge, onCancel }) => {
  const [mergedName, setMergedName] = useState('Birleşik Asansör Anahtarı');
  const [availableFloors, setAvailableFloors] = useState<number[]>([]);

  useEffect(() => {
    const allFloors = new Set<number>();
    cards.forEach(card => {
      card.floors.forEach(floor => allFloors.add(floor));
    });
    setAvailableFloors(Array.from(allFloors).sort((a, b) => a - b));
  }, [cards]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 tracking-tighter">
            <Layers className="text-purple-500" size={24} />
            YETKİ BİRLEŞTİRME
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Key Protokolü</p>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-500 bg-slate-800/50 rounded-full border border-slate-700">
          <X size={18} />
        </button>
      </div>

      <div className="glass rounded-[32px] p-5 space-y-4 border-purple-500/20 shadow-2xl shadow-purple-500/5">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          "{cards.length}" adet farklı karttaki yetkiler çapraz kontrol edilerek tek bir dijital kimlikte senkronize ediliyor.
        </p>
        
        <div className="space-y-2">
          {cards.map((card, idx) => (
            <div key={card.id} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/50 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50"></div>
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                0{idx + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-200">{card.name}</div>
                <div className="text-[9px] text-slate-500 font-mono">{card.serialNumber}</div>
              </div>
              <div className="flex gap-1">
                {card.floors.slice(0, 3).map(f => (
                   <span key={f} className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 w-5 h-5 flex items-center justify-center rounded-md font-black">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-4 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Zap size={80} className="text-purple-500" fill="currentColor" />
          </div>
          <div className="bg-purple-600 p-3 rounded-full shadow-lg shadow-purple-500/40 relative z-10">
            <Zap size={24} className="text-white" fill="currentColor" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 p-5 rounded-[24px] relative">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 text-purple-400">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Yeni Hibrit Yetkiler</span>
             </div>
             <span className="text-[10px] bg-purple-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter">{availableFloors.length} TOPLAM KAT</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableFloors.map(floor => (
              <span key={floor} className="w-9 h-9 flex items-center justify-center text-xs font-black rounded-xl bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40 shadow-inner">
                {floor}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="px-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">KART ETİKETİ</label>
          <input 
            type="text" 
            value={mergedName}
            onChange={e => setMergedName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold text-slate-200"
            placeholder="Örn: Tüm Katlar Kartı"
          />
        </div>

        <button 
          onClick={() => onMerge(mergedName, availableFloors)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-5 rounded-[24px] font-black shadow-xl shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 tracking-widest text-sm"
        >
          <Layers size={22} />
          BİRLEŞİK KARTI OLUŞTUR
        </button>
        
        <p className="text-[9px] text-slate-500 text-center px-8 leading-relaxed font-medium">
          Birleştirme işlemi sonucunda oluşturulan kart, seçtiğiniz tüm kartların yetkilerini kapsayan yeni bir dijital imza taşır.
        </p>
      </div>
    </div>
  );
};

export default MergeView;
