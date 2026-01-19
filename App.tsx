
import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Layers, Zap, Trash2, Info, ChevronRight, CheckCircle2, Wifi, Radio } from 'lucide-react';
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
      serialNumber: "MERGED-" + Date.now().toString(16),
      floors,
      createdAt: Date.now(),
      type: 'merged'
    };
    setCards(prev => [...prev, newMergedCard]);
    setActiveTab('vault');
    setSelectedCardsForMerge([]);
  };

  const toggleCardSelection = (id: string) => {
    setSelectedCardsForMerge(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleUseCard = (card: NFCCard) => {
    setEmulatingCard(card);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
        {/* Teknik Bilgilendirme */}
        <div className="mb-6 p-4 rounded-2xl glass border-blue-500/30 bg-blue-500/5">
          <div className="flex gap-3 text-blue-400 mb-2">
            <Info size={18} />
            <h3 className="text-sm font-semibold">Cihaz Uyumluluğu</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Asansör sistemleri genellikle 13.56MHz (Mifare) veya 125kHz (Proximity) kullanır. Telefonunuz Mifare kartları okuyabilir. Bazı sistemler UID tabanlı çalıştığı için bu cüzdan kimlik yönetimi sağlar.
          </p>
        </div>

        {activeTab === 'vault' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="text-blue-500" size={20} />
                Kartlarım
              </h2>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">
                {cards.length} Kart Kayıtlı
              </span>
            </div>

            {cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center glass rounded-3xl border-dashed border-2 border-slate-700">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Plus className="text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium">Henüz kart eklenmedi</p>
                <p className="text-xs text-slate-500 mt-1">Fiziksel kartınızı okutmak için '+' butonuna basın</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {cards.map(card => (
                  <CardItem 
                    key={card.id} 
                    card={card} 
                    onDelete={() => removeCard(card.id)} 
                    onSelect={() => toggleCardSelection(card.id)}
                    onUse={() => handleUseCard(card)}
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

      {/* Alt Navigasyon ve Aksiyonlar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          {activeTab === 'vault' && (
            <>
              <button 
                onClick={() => setIsScanModalOpen(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
              >
                <Plus size={22} />
                Kart Ekle
              </button>
              {cards.length >= 2 && (
                <button 
                  onClick={() => setActiveTab('merge')}
                  className={`p-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    selectedCardsForMerge.length > 0 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Layers size={22} />
                  {selectedCardsForMerge.length > 0 ? `Birleştir (${selectedCardsForMerge.length})` : 'Seç'}
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
