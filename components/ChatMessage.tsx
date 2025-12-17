import React from 'react';
import { RotateCcw, Bell, Check, ClipboardList } from 'lucide-react';
import { Message, Action, Dish, CartItem, OrderMode, Language } from '../types';
import { THEME, getCategories } from '../constants';
import CategoryList from './CategoryList';
import DishGrid from './DishGrid';
import OrderStatusCard from './OrderStatusCard';

interface ChatMessageProps {
  msg: Message;
  cart: CartItem[];
  onAction: (action: string, payload?: any) => void;
  onAddToCart: (dish: Dish) => void;
  onRemoveFromCart: (id: string) => void;
  orderMode: OrderMode;
  language: Language;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, cart, onAction, onAddToCart, onRemoveFromCart, orderMode, language }) => {
  const isUser = msg.type === 'user';
  const categories = getCategories(language);

  const visibleActions = msg.actions?.filter(action => {
    if (action.action === 'call_waiter_chat') {
      return orderMode === 'dine-in';
    }
    return true;
  });

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in group`}>
      <div className={`
        max-w-[85%] rounded-[20px] p-3.5 text-[15px] leading-relaxed relative
        ${isUser 
          ? THEME.chatUserBg + ' rounded-br-md' 
          : THEME.chatBotBg + ' rounded-tl-md'
        }
      `}>
        {msg.content}
        
        {isUser && (
           <div className="absolute bottom-1 right-2 opacity-50">
             <Check className="w-3 h-3 text-white" />
           </div>
        )}
      </div>

      {!isUser && (
        <div className="w-full mt-3 space-y-3">
           {visibleActions && visibleActions.length > 0 && (
             <div className="flex flex-wrap gap-2 animate-fade-in" style={{animationDelay: '0.1s'}}>
               {visibleActions.map((action, idx) => (
                 <button
                   key={idx}
                   onClick={() => onAction(action.action, action.payload)}
                   className={`px-4 py-2 rounded-full border bg-white text-sm font-semibold hover:bg-pink-50 transition-all active:scale-95 shadow-sm hover:shadow-md flex items-center gap-1.5 
                     ${action.action === 'start_over' ? 'border-gray-200 text-gray-500 hover:text-gray-700' : 'border-pink-100 text-pink-600'}
                     ${action.action === 'call_waiter_chat' ? 'border-pink-200 text-pink-600 bg-pink-50/50' : ''}
                     ${action.action === 'check_order_status' ? 'border-green-200 text-green-600 bg-green-50/50' : ''}
                     `}
                 >
                   {action.action === 'start_over' && <RotateCcw className="w-3.5 h-3.5" />}
                   {action.action === 'call_waiter_chat' && <Bell className="w-3.5 h-3.5" />}
                   {action.action === 'check_order_status' && <ClipboardList className="w-3.5 h-3.5" />}
                   {action.label}
                 </button>
               ))}
             </div>
           )}
           {msg.dataType === 'categories' && (
             <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
                <CategoryList 
                    categories={categories} 
                    onSelect={(name) => onAction('select_category', name)} 
                />
             </div>
           )}
           {msg.dataType === 'dishes' && msg.data && (
             <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <DishGrid 
                    dishes={msg.data} 
                    cart={cart}
                    onAdd={onAddToCart}
                    onRemove={onRemoveFromCart}
                    language={language}
                />
             </div>
           )}
           {msg.dataType === 'order_status' && msg.data && (
             <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <OrderStatusCard order={msg.data} language={language} />
             </div>
           )}
        </div>
      )}
      
      <span className={`text-[10px] mt-1.5 px-1 font-medium ${isUser ? 'text-gray-300' : 'text-gray-400'}`}>
        {!isUser && new Date(msg.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </span>
    </div>
  );
};

export default ChatMessage;