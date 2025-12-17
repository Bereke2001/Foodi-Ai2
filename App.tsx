import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShoppingCart, 
  Send, 
  Utensils, 
  Bike,
  Footprints,
  BookOpen,
  MoreVertical,
  Globe,
  Check
} from 'lucide-react';
import { THEME, getMenuData, getCategories, getInitialActions, TRANSLATIONS } from './constants';
import { Message, CartItem, OrderMode, Dish, Action, Order, Language } from './types';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import CartModal from './components/CartModal';
import ProfileModal from './components/ProfileModal';
import WaiterModal from './components/WaiterModal';
import BrandAvatar from './components/BrandAvatar';

export default function App() {
  const [language, setLanguage] = useState<Language>('ru');
  const t = TRANSLATIONS[language];

  // Dynamic Data based on Language
  const currentMenu = useMemo(() => getMenuData(language), [language]);
  const currentCategories = useMemo(() => getCategories(language), [language]);

  const [messages, setMessages] = useState<Message[]>([]);
  
  // Initialize chat on load
  useEffect(() => {
     setMessages([{ 
        id: 1, 
        type: 'bot', 
        content: t.greeting,
        actions: getInitialActions(language)
      }]);
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderMode, setOrderMode] = useState<OrderMode>('dine-in');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [tableNumber, setTableNumber] = useState('');
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState('');
  const [deliveryExtra, setDeliveryExtra] = useState({ apt: '', floor: '', comment: '' });
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Order Lifecycle Simulation
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'completed') return;

    // Use any[] to avoid NodeJS vs DOM Timer type conflicts in different build environments
    const timers: any[] = [];

    if (activeOrder.status === 'accepted') {
       timers.push(setTimeout(() => {
          setActiveOrder(prev => prev ? { ...prev, status: 'cooking' } : null);
          addBotMessage(t.kitchenCooking, getStandardActions([{ label: t.checkStatus, action: 'check_order_status' }]));
       }, 8000));
    } else if (activeOrder.status === 'cooking') {
       timers.push(setTimeout(() => {
          setActiveOrder(prev => prev ? { ...prev, status: 'ready' } : null);
          const msg = activeOrder.mode === 'delivery' ? t.courierWay : t.orderReady;
          addBotMessage(msg, getStandardActions([{ label: t.checkStatus, action: 'check_order_status' }]));
       }, 12000));
    } else if (activeOrder.status === 'ready') {
       timers.push(setTimeout(() => {
          setActiveOrder(prev => prev ? { ...prev, status: 'completed' } : null);
       }, 10000));
    }

    return () => timers.forEach(clearTimeout);
  }, [activeOrder?.status, language]); // Added language dep to update lifecycle messages if feasible, though msg content is static once added

  const addToCart = (item: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.reduce((acc, item) => {
      if (item.id === itemId) {
        if (item.qty > 1) return [...acc, { ...item, qty: item.qty - 1 }];
        return acc;
      }
      return [...acc, item];
    }, [] as CartItem[]));
  };

  const getStandardActions = (extraActions: Action[] = []) => {
    const actions = [...extraActions];
    actions.push({ label: t.callWaiter, action: 'call_waiter_chat' });
    actions.push({ label: t.startOver, action: 'start_over' });
    return actions;
  };

  const getNextCategories = (currentCatName: string, count = 2) => {
    const currentIndex = currentCategories.findIndex(c => c.name === currentCatName);
    const nextCats = [];
    for (let i = 1; i <= count; i++) {
        const nextIndex = (currentIndex + i) % currentCategories.length;
        nextCats.push(currentCategories[nextIndex]);
    }
    return nextCats;
  };

  const addBotMessage = (content: string, actions: Action[] | null = null, type: 'text' | 'categories' | 'dishes' | 'order_status' = 'text', data: any = null) => {
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      type: 'bot', 
      content, 
      actions,
      dataType: type, 
      data: data
    }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', content }]);
  };

  const handleOrderSuccess = (orderId: string) => {
    let details = '';
    if (orderMode === 'dine-in') {
        details = `${t.yourTable} ${tableNumber}`;
    } else if (orderMode === 'takeaway') {
        details = `${t.takeaway}: ${deliveryDetails}`;
    } else {
        details = `${t.delivery}: ${deliveryDetails}`;
        if (deliveryExtra.comment) details += `. ${deliveryExtra.comment}`;
    }

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
      status: 'accepted',
      mode: orderMode,
      details: details,
      createdAt: Date.now(),
    };

    setActiveOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
    
    setTableNumber('');
    setDeliveryDetails('');
    setDeliveryExtra({ apt: '', floor: '', comment: '' });

    addBotMessage(
      `${t.orderAccepted} ${t.trackStatus}`,
      getStandardActions([
        { label: t.checkStatus, action: 'check_order_status' }
      ])
    );
  };

  const handleCallWaiter = () => {
    if (orderMode !== 'dine-in') return;
    
    if (!tableNumber) {
        setIsProfileOpen(false); 
        setIsWaiterModalOpen(true); 
        return;
    }
    addBotMessage(`${t.callWaiterChat} №${tableNumber}.`);
    setIsWaiterModalOpen(false);
    setIsProfileOpen(false);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
    // We restart the chat to apply new language to initial messages seamlessly
    const newT = TRANSLATIONS[lang];
    setMessages([{ 
        id: Date.now(), 
        type: 'bot', 
        content: newT.resetChat,
        actions: getInitialActions(lang)
    }]);
  };

  const handleUserAction = (action: string, payload?: any) => {
    if (action === 'start_over') {
        setMessages([{ 
            id: Date.now(), 
            type: 'bot', 
            content: t.resetChat,
            actions: getInitialActions(language)
        }]);
        return;
    }

    if (action === 'call_waiter_chat') {
        handleCallWaiter();
        return;
    }

    if (action === 'check_order_status') {
        if (activeOrder) {
            addBotMessage(
                t.statusInfo,
                getStandardActions([{ label: t.showMenu, action: 'show_categories' }]),
                'order_status',
                activeOrder
            );
        } else {
            addBotMessage(
                t.noOrders,
                getStandardActions([{ label: t.showMenu, action: 'show_categories' }])
            );
        }
        return;
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (action === 'show_categories') {
        addBotMessage(t.chooseCategory, null, 'categories');
      } 
      else if (action === 'select_category' || action === 'select_category_direct') {
        const catName = payload;
        if (action === 'select_category') {
             addUserMessage(catName);
             setIsTyping(true);
        }

        setTimeout(() => {
            setIsTyping(false);
            addBotMessage(`${t.hereIs} "${catName}":`, null, 'dishes', currentMenu[catName]);
            
            setTimeout(() => {
                const nextCats = getNextCategories(catName, 2);
                const nextActions = nextCats.map(cat => ({
                    label: `${t.show} ${cat.name} ${cat.emoji}`,
                    action: 'select_category_direct',
                    payload: cat.name
                }));
                
                addBotMessage(t.wantMore, getStandardActions(nextActions));
            }, 1000);
        }, 500);
      }
      else if (action === 'show_recommendations') {
        addUserMessage(t.advice);
        setTimeout(() => {
             setIsTyping(false);
             
             // Get some random items
             const allDishes = Object.values(currentMenu).flat();
             const recommendations = allDishes.slice(0, 4);

             addBotMessage(
                t.hits, 
                getStandardActions([
                    { label: t.showMenu, action: 'show_categories' }
                ]),
                'dishes',
                recommendations
            );
        }, 600);
      }
      else if (action === 'ask_question') {
          addUserMessage(t.askQuestion);
          setTimeout(() => {
               setIsTyping(false);
               addBotMessage(t.writeQuestion, getStandardActions());
          }, 500);
      }
      else if (action === 'send_text') {
        const text = payload;
        addUserMessage(text);
        
        setTimeout(() => {
            setIsTyping(false);
            addBotMessage(t.learning, 
                getStandardActions([
                    { label: t.showMenu, action: 'show_categories' }
                ])
            );
        }, 800);
      }
    }, 600);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    handleUserAction('send_text', inputValue);
    setInputValue('');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div 
      className="h-screen flex flex-col font-sans overflow-hidden relative bg-[#F8FAFC]" 
      style={{
        backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. MODERN HEADER - Sticky Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 transition-all duration-300">
        <div className="max-w-md mx-auto w-full">
          
          {/* Top Row: Brand & Language */}
          <div className="flex items-center justify-between px-5 py-3">
              <div 
                className="flex items-center gap-3.5 cursor-pointer group" 
                onClick={() => setIsProfileOpen(true)}
              >
                <div className="relative">
                   <div className="w-10 h-10 rounded-[14px] overflow-hidden shadow-lg ring-2 ring-white ring-offset-2 ring-offset-pink-50 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                     <BrandAvatar />
                   </div>
                   <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                     <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white relative">
                       <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                     </div>
                   </div>
                </div>
                <div>
                   <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none group-hover:text-pink-600 transition-colors">SOUS</h1>
                   <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide opacity-80">{t.online}</span>
                   </div>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="relative">
                 <button 
                   onClick={(e) => { e.stopPropagation(); setIsLangMenuOpen(!isLangMenuOpen); }}
                   className="flex items-center gap-2 h-9 pl-2 pr-3.5 rounded-full bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-pink-100 transition-all active:scale-95 group"
                 >
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-sm shadow-inner group-hover:scale-110 transition-transform">
                       {language === 'ru' ? '🇷🇺' : language === 'en' ? '🇺🇸' : '🇸🇦'}
                    </div>
                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 uppercase">{language}</span>
                 </button>
                 
                 {isLangMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)}></div>
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-[140px] animate-fade-in z-50 flex flex-col py-1">
                            <button onClick={() => changeLanguage('ru')} className={`px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 flex items-center justify-between transition-colors ${language === 'ru' ? 'text-pink-600 bg-pink-50' : 'text-gray-700'}`}>
                                <div className="flex items-center gap-2"><span>🇷🇺</span> Русский</div>
                                {language === 'ru' && <Check className="w-3 h-3" />}
                            </button>
                            <button onClick={() => changeLanguage('en')} className={`px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 flex items-center justify-between transition-colors ${language === 'en' ? 'text-pink-600 bg-pink-50' : 'text-gray-700'}`}>
                                <div className="flex items-center gap-2"><span>🇺🇸</span> English</div>
                                {language === 'en' && <Check className="w-3 h-3" />}
                            </button>
                            <button onClick={() => changeLanguage('ar')} className={`px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 flex items-center justify-between transition-colors ${language === 'ar' ? 'text-pink-600 bg-pink-50' : 'text-gray-700'}`}>
                                <div className="flex items-center gap-2"><span>🇸🇦</span> العربية</div>
                                {language === 'ar' && <Check className="w-3 h-3" />}
                            </button>
                        </div>
                    </>
                 )}
              </div>
          </div>

          {/* Bottom Row: Order Mode Segmented Control */}
          <div className="px-4 pb-3">
             <div className="bg-gray-100/70 p-1.5 rounded-2xl flex relative backdrop-blur-sm">
                 {(['dine-in', 'takeaway', 'delivery'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setOrderMode(mode)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-extrabold transition-all duration-300 relative z-10 ${
                        orderMode === mode 
                          ? 'bg-white text-pink-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)] scale-[1.02] ring-1 ring-black/5' 
                          : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                      }`}
                    >
                      {mode === 'dine-in' && <Utensils className={`w-3.5 h-3.5 ${orderMode === mode ? 'fill-pink-600/10 stroke-[2.5px]' : ''}`} />}
                      {mode === 'takeaway' && <Footprints className={`w-3.5 h-3.5 ${orderMode === mode ? 'fill-pink-600/10 stroke-[2.5px]' : ''}`} />}
                      {mode === 'delivery' && <Bike className={`w-3.5 h-3.5 ${orderMode === mode ? 'fill-pink-600/10 stroke-[2.5px]' : ''}`} />}
                      {mode === 'dine-in' ? t.dineIn : mode === 'takeaway' ? t.takeaway : t.delivery}
                    </button>
                 ))}
             </div>
          </div>
        </div>
      </header>

      {/* 2. CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 z-10">
        <div className="flex justify-center mb-6">
           <span className="text-[10px] font-bold text-gray-500 bg-gray-200/60 border border-gray-200 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">{t.today}</span>
        </div>

        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            msg={msg} 
            cart={cart}
            onAction={handleUserAction}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            orderMode={orderMode}
            language={language}
          />
        ))}
        
        {isTyping && (
          <div className="items-start animate-fade-in pl-1">
             <TypingIndicator />
          </div>
        )}

        <div ref={chatEndRef} className="h-2" />
      </div>

      {/* 3. CHAT FOOTER - Glassmorphism Floating Input */}
      <div className="glass border-t border-gray-100 p-3 pb-6 z-20">
         <div className="flex items-end gap-2 max-w-3xl mx-auto">
            <button 
               onClick={() => handleUserAction('show_categories')}
               className="h-12 w-12 shrink-0 rounded-full text-gray-500 hover:bg-pink-50 hover:text-pink-500 flex items-center justify-center transition-all duration-300"
               title={t.showMenu}
            >
               <BookOpen className="w-6 h-6" />
            </button>

            <div className="flex-1 bg-gray-100/70 rounded-3xl px-5 py-3 flex items-center focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-200 transition-all border border-transparent focus-within:border-pink-200 shadow-inner">
               <input 
                 type="text" 
                 className="bg-transparent w-full outline-none text-base text-gray-800 placeholder:text-gray-400"
                 placeholder={t.inputPlaceholder}
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
               />
            </div>

            {inputValue.trim() ? (
               <button 
                  onClick={handleSendMessage}
                  className={`h-12 w-12 shrink-0 rounded-full ${THEME.gradient} text-white flex items-center justify-center shadow-lg shadow-pink-200 active:scale-95 transition-transform`}
               >
                  <Send className="w-5 h-5 ml-0.5" />
               </button>
            ) : (
               <button 
                  onClick={() => setIsCartOpen(true)}
                  className={`h-12 w-12 shrink-0 rounded-full ${cartCount > 0 ? THEME.gradient + ' text-white shadow-lg shadow-pink-200' : 'bg-gray-100 text-gray-500'} flex items-center justify-center transition-all active:scale-95 relative`}
               >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                     <span className="absolute -top-1 -right-1 bg-white text-pink-600 text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center shadow-sm border border-pink-100">
                        {cartCount}
                     </span>
                  )}
               </button>
            )}
         </div>
      </div>

      {/* 4. MODALS */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        orderMode={orderMode} 
        onCallWaiter={handleCallWaiter}
        language={language}
      />

      <WaiterModal 
        isOpen={isWaiterModalOpen} 
        onClose={() => setIsWaiterModalOpen(false)} 
        tableNumber={tableNumber} 
        setTableNumber={setTableNumber} 
        onConfirm={handleCallWaiter}
        language={language}
      />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        orderMode={orderMode}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        deliveryDetails={deliveryDetails}
        setDeliveryDetails={setDeliveryDetails}
        deliveryExtra={deliveryExtra}
        setDeliveryExtra={setDeliveryExtra}
        onOrderSuccess={handleOrderSuccess}
        language={language}
      />
    </div>
  );
}