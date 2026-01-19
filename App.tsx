
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
          <div className="space-y