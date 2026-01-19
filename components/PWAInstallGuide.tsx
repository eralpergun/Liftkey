
import React from 'react';
import { Share, PlusSquare, X, Download } from 'lucide-react';

interface PWAInstallGuideProps {
  onClose: () => void;
}

const PWAInstallGuide: React.FC<PWAInstallGuideProps> = ({ onClose }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm glass rounded-[32px] p-6 mb-4 shadow-2xl border-blue-500/20">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Download className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Uygulamayı Yükle</h3>
              <p className="text-xs text-slate-400">Daha hızlı erişim ve tam ekran</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 bg-slate-800 rounded-full">
            <X size={16} />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Share size={20} />
              </div>
              <p className="text-sm font-medium">1. Tarayıcıda 'Paylaş' butonuna basın.</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <PlusSquare size={20} />
              </div>
              <p className="text-sm font-medium">2. 'Ana Ekrana Ekle' seçeneğini seçin.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-400 px-2">
              Android cihazınızda tarayıcı menüsünden "Uygulamayı Yükle" veya "Ana Ekrana Ekle" seçeneğine dokunarak yükleyebilirsiniz.
            </p>
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full mt-6 bg-blue-600 py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all"
        >
          Anladım
        </button>
      </div>
    </div>
  );
};

export default PWAInstallGuide;
