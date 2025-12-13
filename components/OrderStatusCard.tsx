import React from 'react';
import { Check, ChefHat, Clock, MapPin, Bike, Utensils } from 'lucide-react';
import { Order, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface OrderStatusCardProps {
  order: Order;
  language: Language;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ order, language }) => {
  const t = TRANSLATIONS[language];

  const steps = [
    { id: 'accepted', label: t.statusAccepted, icon: Check },
    { id: 'cooking', label: t.statusCooking, icon: ChefHat },
    { id: 'ready', label: order.mode === 'delivery' ? t.statusWay : t.statusReady, icon: order.mode === 'delivery' ? Bike : Utensils },
    { id: 'completed', label: t.statusCompleted, icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-sm animate-fade-in mt-2">
       {/* Header */}
       <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t.orderNum}#{order.id}</p>
             <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
          <div className="text-right">
             <p className="text-rose-600 font-bold text-lg">{order.total}₸</p>
             <p className="text-xs text-gray-400 font-medium">{order.mode === 'dine-in' ? t.dineIn : order.mode === 'takeaway' ? t.takeaway : t.delivery}</p>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="relative mb-8 px-2">
          {/* Background Line */}
          <div className="absolute top-4 left-0 w-full h-1.5 bg-gray-100 -z-10 rounded-full"></div>
          
          {/* Active Line */}
          <div 
            className="absolute top-4 left-0 h-1.5 bg-green-500 -z-10 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="flex justify-between relative">
             {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;
                
                return (
                   <div key={step.id} className="flex flex-col items-center gap-2 w-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10
                         ${isCompleted ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-200' : 'bg-white border-gray-200 text-gray-300'}
                         ${isCurrent ? 'scale-110 ring-4 ring-green-100' : ''}
                      `}>
                         <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-bold text-center uppercase tracking-wide transition-colors duration-300 absolute -bottom-6 w-20
                          ${isCompleted ? 'text-gray-800' : 'text-gray-300'}
                      `}>
                          {step.label}
                      </span>
                   </div>
                );
             })}
          </div>
       </div>

       {/* Items Preview */}
       <div className="bg-gray-50 rounded-xl p-3 space-y-2 mt-2">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.orderContents}</p>
          {order.items.slice(0, 3).map(item => (
             <div key={item.id} className="flex justify-between text-sm items-center">
                <span className="text-gray-700 font-medium truncate pr-4">{item.name}</span>
                <span className="text-gray-500 whitespace-nowrap text-xs">{item.qty} x {item.price}₸</span>
             </div>
          ))}
          {order.items.length > 3 && (
              <p className="text-xs text-gray-400 text-center pt-1 italic">{t.moreItems} {order.items.length - 3} {t.pcs}.</p>
          )}
       </div>
    </div>
  );
};

export default OrderStatusCard;