
import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, Zap, X } from 'lucide-react';
import { NFCCard } from '../types';

interface MergeViewProps {
  cards: NFCCard[];
  onMerge: (name: string, floors: number[]) => void;
  onCancel: () => void;
}

const MergeView: React.FC<MergeViewProps> = ({ cards, onMerge, onCancel }) => {
  const [mergedName, setMergedName] = useState('Hibrit Geçiş Kartı');
  const [availableFloors, setAvailableFloors] = useState<number[]>([]);

  useEffect(() => {
    const allFloors = new Set<number>();
    cards.forEach(card => {
      card.floors.forEach(floor => allFloors.add(floor));
    });
    setAvailableFloors(Array.from(allFloors).sort((a, b) => a - b));
  }, [cards]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="text-purple-500" size={20} />
          Yetkileri Birleştir
        </h2>
        <button onClick={onCancel} className="p-2 text-slate-500 bg-slate-800 rounded-full">
          <X size={16} />
        </button>
      </div>

      <div className="glass rounded-2xl p-4 space-y-4">
        <p className="text-sm text-slate-400">
          {cards.length} farklı karttaki yetkiler tek bir dijital kimlikte toplanıyor.
        </p>
        
        <div className="space-y-3">
          {cards.map(card => (
            <div key={card.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <div className="w-1.5 h-10 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{card.name}</div>
                <div className="text-[10px] text-slate-500">{card.floors.length} kat yetkisi</div>
              </div>
              <div className="flex gap-1">
                {card.floors.slice(0, 3).map(f => (
                   <span key={f} className="text-[8px] bg-slate-700 w-5 h-5 flex items-center justify-center rounded-sm font-bold">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-2 text-purple-400">
          <ArrowRight size={24} className="rotate-90" />
        </div>

        <div className="bg-purple-500/5 border-2 border-dashed border-purple-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2 text-purple-400">
                <Zap size={16} fill="currentColor" />
                <span className="text-xs font-bold uppercase tracking-tighter">Birleşik Yetkiler</span>
             </div>
             <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full font-bold">{availableFloors.length} Toplam Kat</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableFloors.map(floor => (
              <span key={floor} className="w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30">
                {floor}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 px-1">Yeni Kart Adı</label>
          <input 
            type="text" 
            value={mergedName}
            onChange={e => setMergedName(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        <button 
          onClick={() => onMerge(mergedName, availableFloors)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Layers size={20} />
          Birleşik Kartı Oluştur
        </button>
      </div>
    </div>
  );
};

export default MergeView;
