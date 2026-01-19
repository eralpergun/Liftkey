
import React, { useState, useEffect } from 'react';
import { CreditCard, Layers, Zap, Smartphone, Download, Smartphone as SmartphoneIcon } from 'lucide-react';
import { NFCCard } from './types';
import CardItem from './components/CardItem';
import ScanModal from './components/ScanModal';
import Header from './components/Header';
import MergeView from './components/MergeView';
import EmulationView from './components/EmulationView';

const App: React.FC = () => {
  const [cards, setCards] = useState<NFCCard[]>(() => {
    const saved = localStorage.getItem('liftkey_cards');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<'vault' | 'merge'>('vault');
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedCardsForMerge, setSelectedCardsForMerge] = useState<string[]>([]);
  const [emulatingCard, setEmulatingCard] = useState<NFCCard | null>(null);

  // URL'den NFC verisi gelmiş mi kontrol et (iOS Shortcut Bridge)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');
    if (uid) {
      setIsScanModalOpen(true);
      // URL parametrelerini temizle
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('liftkey_cards', JSON.stringify(cards));
  }, [cards]);

  const addCard = (card: NFCCard) => {
    setCards(prev => [...prev, card]);
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setSelectedCardsForMerge(prev => prev.filter(cardId => cardId !== id));
  };

  const handleMerge = (name: string, floors: number[]) => {
    const newMergedCard: NFCCard = {
      id: crypto.randomUUID(),
      name,
      serialNumber: "MK-" + floors.join('').slice(0, 8) + "-" + Math.random().toString(16).slice(2, 6).toUpperCase(),
      floors,
      createdAt: Date.now(),
      type: 'merged'
    };
    setCards(prev => [...prev, newMergedCard]);
    setActiveTab('vault');
    setSelectedCardsForMerge(prev => []);
  };

  const toggleCardSelection = (id: string) => {
    setSelectedCardsForMerge(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
        {activeTab === 'vault' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
                <CreditCard className="text-blue-500" size={20} />
                KART KASASI
              </h2>
            </div>

            {cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-[40px] border-dashed border-2 border-slate-700/50">
                <div className="w-24 h-24 bg-slate-800/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-900 animate-pulse">
                  <SmartphoneIcon className="text-slate-600" size={40} />
                </div>
                <h3 className="text-slate-200 font-black text-lg">HİÇ KART YOK</h3>
                <p className="text-[11px] text-slate-500 mt-2 max-w-[220px] leading-relaxed uppercase tracking-widest font-bold">
                  Asansör kartlarınızı tarayın ve yetkileri birleştirin.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {cards.map(card => (
                  <CardItem 
                    key={card.id} 
                    card={card} 
                    onDelete={() => removeCard(card.id)} 
                    onSelect={() => toggleCardSelection(card.id)}
                    onUse={() => setEmulatingCard(card)}
                    isSelected={selectedCardsForMerge.includes(card.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <MergeView 
            cards={cards.filter(c => selectedCardsForMerge.includes(c.id))} 
            onMerge={handleMerge}
            onCancel={() => setActiveTab('vault')}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 py-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none z-40">
        <div className="flex gap-3 pointer-events-auto">
          {activeTab === 'vault' && (
            <>
              <button 
                onClick={() => setIsScanModalOpen(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[28px] font-black tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/40 active:scale-95 transition-all text-sm"
              >
                <Smartphone size={24} strokeWidth={2.5} />
                YENİ KART EKLE
              </button>
              {cards.length >= 2 && (
                <button 
                  onClick={() => setActiveTab('merge')}
                  className={`p-5 rounded-[28px] font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                    selectedCardsForMerge.length >= 2 
                    ? 'bg-purple-600 text-white shadow-purple-500/30 ring-2 ring-purple-400' 
                    : 'bg-slate-800 text-slate-400 opacity-50'
                  }`}
                >
                  <Layers size={24} />
                </button>
              )}
            </>
          )}
        </div>
      </nav>

      <ScanModal 
        isOpen={isScanModalOpen} 
        onClose={() => setIsScanModalOpen(false)} 
        onCardDetected={addCard} 
      />

      <EmulationView 
        card={emulatingCard} 
        onClose={() => setEmulatingCard(null)} 
      />
    </div>
  );
};

export default App;
