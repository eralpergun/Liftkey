
import React from 'react';
import { Trash2, ShieldCheck, Layers, Hash, Zap } from 'lucide-react';
import { NFCCard } from '../types';

interface CardItemProps {
  card: NFCCard;
  onDelete: () => void;
  onSelect: () => void;
  onUse: () => void;
  isSelected: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ card, onDelete, onSelect, onUse, isSelected }) => {
  const isMerged = card.type === 'merged';

  return (
    <div 
      className={`group relative glass rounded-2xl p-4 transition-all cursor-pointer border-l-4 ${
        isSelected ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/50' : 
        isMerged ? 'border-purple-500' : 
        card.type === 'new' ? 'border-emerald-500' : 'border-slate-500'
      }`}
    >
      <div onClick={onSelect} className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isMerged ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
            {isMerged ? <Layers size={20} /> : <ShieldCheck size={20} />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">{card.name}</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              <Hash size={10} />
              <span>{card.serialNumber.slice(-8)}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {card.floors.length > 0 ? (
          card.floors.map(floor => (
            <span key={floor} className="w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-md bg-slate-800 text-slate-300 ring-1 ring-slate-700/50">
              {floor}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-slate-500 italic">Kat atanmadı</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
            card.type === 'merged' ? 'bg-purple-500/10 text-purple-400' :
            card.type === 'new' ? 'bg-emerald-500/10 text-emerald-400' :
            'bg-slate-700 text-slate-400'
          }`}>
            {isMerged ? 'Birleşik' : 'Fiziksel'} Kart
          </span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onUse();
          }}
          className="flex items-center gap-1 text-[10px] font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Zap size={12} fill="currentColor" />
          KULLAN
        </button>
      </div>

      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-0.5 shadow-lg">
          <ShieldCheck size={14} />
        </div>
      )}
    </div>
  );
};

export default CardItem;
