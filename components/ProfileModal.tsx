import React from 'react';
import { ChevronLeft, MapPin, Clock, Phone, Bell } from 'lucide-react';
import { Language, OrderMode } from '../types';
import { TRANSLATIONS } from '../constants';
import BrandAvatar from './BrandAvatar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderMode: OrderMode;
  onCallWaiter: () => void;
  language: Language;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, orderMode, onCallWaiter, language }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-slide-in-right overflow-y-auto">
       <div className="absolute top-5 left-5 z-20">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
       </div>

       <div className="relative h-72 bg-gray-900 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover opacity-90" alt="Cover" />
          
          <div className="absolute -bottom-12 left-6 z-20">
             <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-100">
                <BrandAvatar />
             </div>
          </div>
       </div>

       <div className="px-6 pt-16 pb-8 flex-1 bg-white">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Foodi Burger</h1>
          <p className="text-gray-500 mb-8 font-medium">Best burgers in town 🔥</p>

          <div className="space-y-6 mb-10">
             <div className="flex items-start gap-4 group">
                <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 group-hover:bg-rose-100 transition-colors"><MapPin className="w-6 h-6" /></div>
                <div>
                   <h3 className="font-bold text-gray-900 text-lg">{t.profileAddress}</h3>
                   <p className="text-gray-500 font-medium">Abay 10, Almaty</p>
                </div>
             </div>
             <div className="flex items-start gap-4 group">
                <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 group-hover:bg-rose-100 transition-colors"><Clock className="w-6 h-6" /></div>
                <div>
                   <h3 className="font-bold text-gray-900 text-lg">{t.profileTime}</h3>
                   <p className="text-gray-500 font-medium">10:00 - 23:00</p>
                </div>
             </div>
             <div className="flex items-start gap-4 group">
                <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 group-hover:bg-rose-100 transition-colors"><Phone className="w-6 h-6" /></div>
                <div>
                   <h3 className="font-bold text-gray-900 text-lg">{t.profilePhone}</h3>
                   <p className="text-gray-500 font-medium">+7 (777) 123-45-67</p>
                </div>
             </div>
          </div>

          {orderMode === 'dine-in' && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-3xl p-5 border border-orange-100 shadow-sm">
               <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2 text-lg">
                 <Bell className="w-5 h-5 fill-orange-800" /> {t.areYouIn}
               </h3>
               <p className="text-sm text-orange-700/80 mb-5 font-medium leading-relaxed">{t.callWaiter}</p>
               <button 
                 onClick={onCallWaiter}
                 className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-200 active:scale-95 transition-all hover:bg-orange-600 hover:shadow-orange-300"
               >
                 {t.callWaiterBtn}
               </button>
            </div>
          )}
       </div>
    </div>
  );
};

export default ProfileModal;