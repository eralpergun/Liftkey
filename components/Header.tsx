
import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="p-4 flex flex-col gap-1">
      <div className="flex justify-between items-center text-[10px] text-slate-600 px-1 mb-2 font-bold uppercase tracking-widest">
        <span>ASANSÖR ERİŞİMİ</span>
        <div className="flex gap-1.5 items-center">
          <Signal size={12} />
          <Wifi size={12} />
          <Battery size={12} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent italic">
            LIFTKEY
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Akıllı RFID Yönetici</p>
        </div>
        <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center border-blue-500/20 rotate-3">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
