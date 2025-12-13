import React from 'react';
import { Clock, Plus, Minus } from 'lucide-react';
import { Dish, CartItem, Language } from '../types';
import { THEME, TRANSLATIONS } from '../constants';

interface DishGridProps {
  dishes: Dish[];
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onRemove: (id: string) => void;
  language: Language;
}

const DishGrid: React.FC<DishGridProps> = ({ dishes, cart, onAdd, onRemove, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex gap-4 overflow-x-auto w-full pb-8 pt-4 px-1 no-scrollbar snap-x scroll-pl-4 items-stretch">
      {dishes.map(dish => {
        const inCart = cart.find(i => i.id === dish.id);
        return (
          <div key={dish.id} className="min-w-[220px] w-[220px] sm:min-w-[240px] sm:w-[240px] flex-shrink-0 snap-start bg-white rounded-[24px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col animate-fade-in hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 h-auto group overflow-hidden relative">
            
            {/* Image Area */}
            <div className="relative h-40 w-full overflow-hidden bg-gray-50">
               <img 
                 src={dish.img} 
                 alt={dish.name} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
               
               {/* Time Badge */}
               <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-800 flex items-center shadow-sm border border-white/50">
                 <Clock className="w-3 h-3 mr-1 text-rose-500" /> {dish.time}
               </div>
            </div>
            
            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-2">
                 <h3 className="font-extrabold text-lg text-gray-900 leading-snug tracking-tight mb-1.5 group-hover:text-rose-600 transition-colors">{dish.name}</h3>
                 <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed h-[2.5em]">{dish.desc}</p>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                 <span className="font-black text-xl text-gray-900 tracking-tight">{dish.price}<span className="text-sm font-bold text-gray-400 ml-0.5">₸</span></span>

                {inCart ? (
                   <div className="flex items-center bg-gray-900 rounded-2xl h-11 px-1.5 shadow-xl shadow-gray-200 ring-2 ring-gray-50">
                      <button onClick={() => onRemove(dish.id)} className="w-9 h-full flex items-center justify-center text-white hover:text-rose-400 active:scale-75 transition-all"><Minus className="w-4 h-4" /></button>
                      <span className="text-sm font-bold w-5 text-center text-white select-none">{inCart.qty}</span>
                      <button onClick={() => onAdd(dish)} className="w-9 h-full flex items-center justify-center text-white hover:text-green-400 active:scale-75 transition-all"><Plus className="w-4 h-4" /></button>
                   </div>
                ) : (
                  <button 
                    onClick={() => onAdd(dish)}
                    className={`h-11 px-5 rounded-2xl ${THEME.gradient} text-white text-sm font-bold shadow-lg shadow-rose-200 active:scale-95 transition-all hover:shadow-xl hover:shadow-rose-300 flex items-center justify-center gap-1.5`}
                  >
                    <Plus className="w-4 h-4" /> {t.addToCart}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div className="w-2 flex-shrink-0" />
    </div>
  );
};

export default DishGrid;