
export interface NFCCard {
  id: string;
  name: string;
  serialNumber: string;
  floors: number[];
  createdAt: number;
  type: 'old' | 'new' | 'merged';
}

export interface AppState {
  cards: NFCCard[];
  isScanning: boolean;
  scanLog: string[];
}

// Extend Window to include NFC types for TypeScript
declare global {
  interface Window {
    NDEFReader: any;
  }
}
