import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface WaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  setTableNumber: (val: string) => void;
  onConfirm: () => void;
  language: Language;
}

const WaiterModal: React.FC<WaiterModalProps> = ({ isOpen, onClose, tableNumber, setTableNumber, onConfirm, language }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
       <div className="bg-white rounded-2xl p-6 w-full max-w-xs relative z-10 shadow-2xl animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.callWaiterModalTitle}</h3>
          <p className="text-sm text-gray-500 mb-4">{t.enterTableNum}</p>
          <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 mb-4">
             <input 
                type="number" 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full bg-transparent text-lg font-bold text-gray-900 outline-none text-center"
                placeholder="№"
                autoFocus
             />
          </div>
          <div className="flex gap-2">
             <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">{t.cancel}</button>
             <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-200">{t.call}</button>
          </div>
       </div>
    </div>
  );
};

export default WaiterModal;