import React, { useMemo, useState, useEffect } from 'react';
import { X, ShoppingBag, Utensils, Footprints, Bike, Plus, Minus, Trash2, ArrowLeft, CreditCard, Banknote, CheckCircle, Smartphone, Loader2, Clock, ChevronDown, MapPin, FileText, Navigation } from 'lucide-react';
import { CartItem, OrderMode, Dish, Language } from '../types';
import { THEME, getMenuData, TRANSLATIONS } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onRemove: (id: string) => void;
  orderMode: OrderMode;
  tableNumber: string;
  setTableNumber: (val: string) => void;
  deliveryDetails: string;
  setDeliveryDetails: (val: string) => void;
  deliveryExtra: { apt: string; floor: string; comment: string };
  setDeliveryExtra: (val: { apt: string; floor: string; comment: string }) => void;
  onOrderSuccess?: (orderId: string) => void;
  language: Language;
}

type ModalStep = 'cart' | 'payment' | 'success';
type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'cash';

const CartModal: React.FC<CartModalProps> = ({
  isOpen, onClose, cart, onAdd, onRemove, orderMode, tableNumber, setTableNumber, deliveryDetails, setDeliveryDetails, deliveryExtra, setDeliveryExtra, onOrderSuccess, language
}) => {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState<ModalStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Logic for Upsell - Needs current Menu Data
  const currentMenu = useMemo(() => getMenuData(language), [language]);
  
  const upsellItems = useMemo(() => {
    const allItems = Object.values(currentMenu).flat() as Dish[];
    return allItems.filter(item => !cart.find(c => c.id === item.id)).slice(0, 5);
  }, [cart, currentMenu]);

  // Generate 15-min interval time slots for takeaway
  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    let time = new Date(Math.ceil(now.getTime() / (15 * 60000)) * (15 * 60000));
    time = new Date(time.getTime() + 15 * 60000);

    for (let i = 0; i < 8; i++) {
        const h = time.getHours().toString().padStart(2, '0');
        const m = time.getMinutes().toString().padStart(2, '0');
        slots.push(`${h}:${m}`);
        time = new Date(time.getTime() + 15 * 60000);
    }
    return slots;
  }, []);

  useEffect(() => {
      if (isOpen && orderMode === 'takeaway' && !deliveryDetails) {
          setDeliveryDetails(t.asap);
      }
  }, [isOpen, orderMode, language]);

  useEffect(() => {
    if (isOpen) {
      setStep('cart');
      setIsProcessing(false);
      setIsMapOpen(false);
      setGeneratedOrderId(Math.floor(1000 + Math.random() * 9000).toString());
    }
  }, [isOpen]);

  const handleMapConfirm = () => {
    setDeliveryDetails(language === 'ru' ? 'пр. Абая 44' : language === 'en' ? 'Abay Ave 44' : 'شارع أباي 44');
    setIsMapOpen(false);
  };

  if (!isOpen) return null;

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const isValid = orderMode === 'dine-in' ? tableNumber.length > 0 : deliveryDetails.length > 0;

  const handleCheckout = () => {
    if (isValid) {
      setStep('payment');
    }
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  if (isMapOpen) {
    return (
      <div className="fixed inset-0 z-[60] flex justify-end">
         <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setIsMapOpen(false)}></div>
         <div className="relative w-full max-w-sm bg-gray-100 h-full shadow-2xl flex flex-col animate-slide-in-right">
             <div className="absolute top-0 left-0 right-0 p-5 z-20 flex justify-between items-start pointer-events-none">
                <button onClick={() => setIsMapOpen(false)} className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 pointer-events-auto">
                   <ArrowLeft className="w-5 h-5" />
                </button>
             </div>
             <div className="flex-1 relative overflow-hidden bg-[#e5e7eb] flex items-center justify-center">
                 <iframe 
                    className="w-full h-full grayscale-[0.2] opacity-90"
                    src="https://maps.google.com/maps?q=Abay+Ave+44,+Almaty&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                    title="Google Map"
                    style={{ border: 0 }}
                 />
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-8 flex flex-col items-center animate-bounce pointer-events-none z-10">
                    <MapPin className="w-10 h-10 text-rose-600 drop-shadow-lg fill-rose-600" />
                    <div className="w-3 h-1.5 bg-black/20 rounded-[100%] blur-[2px] mt-1"></div>
                 </div>
                 
                 <div className="absolute top-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 shadow-sm z-10 border border-white/50">
                    {t.mapSelection}
                 </div>
             </div>
             <div className="bg-white p-5 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20 space-y-4">
                 <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{t.selectedAddress}</p>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <MapPin className="w-5 h-5 text-rose-500" /> {language === 'ru' ? 'пр. Абая 44' : language === 'en' ? 'Abay Ave 44' : 'شارع أباي 44'}
                    </h3>
                 </div>
                 <button 
                    onClick={handleMapConfirm}
                    className={`w-full py-4 rounded-2xl ${THEME.gradient} text-white font-bold shadow-lg shadow-rose-200 active:scale-95 transition-all`}
                 >
                    {t.confirmAddress}
                 </button>
             </div>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
       <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>
       <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
          
          {/* HEADER */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm">
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {step === 'cart' && <><span className="bg-rose-100 text-rose-600 p-1.5 rounded-lg"><ShoppingBag className="w-5 h-5" /></span> {t.cartTitle}</>}
                {step === 'payment' && <><span className="bg-rose-100 text-rose-600 p-1.5 rounded-lg"><CreditCard className="w-5 h-5" /></span> {t.paymentTitle}</>}
                {step === 'success' && <><span className="bg-green-100 text-green-600 p-1.5 rounded-lg"><CheckCircle className="w-5 h-5" /></span> {t.successTitle}</>}
             </h2>
             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-gray-50/50 scroll-smooth relative">
             {step === 'cart' && (
                <div className="p-5 space-y-4">
                  {cart.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-fade-in">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                         <ShoppingBag className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="font-bold text-lg text-gray-600">{t.emptyCart}</p>
                      <button onClick={onClose} className="mt-6 px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors shadow-sm">
                        {t.goToMenu}
                      </button>
                   </div>
                  ) : (
                    <>
                     <div className="space-y-3">
                       {cart.map(item => (
                         <div key={item.id} className="flex justify-between items-start bg-white p-3 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                            <div className="flex gap-3">
                               <img src={item.img} alt="" className="w-16 h-16 object-cover rounded-xl" />
                               <div className="pt-0.5">
                                  <p className="font-bold text-sm text-gray-800 leading-tight mb-1">{item.name}</p>
                                  <p className="text-rose-600 font-bold text-xs">{item.price * item.qty}₸</p>
                                  {item.qty > 1 && <span className="text-[10px] text-gray-400">({item.price}₸ / {t.pcs})</span>}
                               </div>
                            </div>
                            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 h-8 self-center">
                               <button onClick={() => onRemove(item.id)} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-rose-500 active:scale-90">{item.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}</button>
                               <span className="text-xs font-bold w-6 text-center text-gray-800">{item.qty}</span>
                               <button onClick={() => onAdd(item)} className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-green-600 active:scale-90"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                         </div>
                       ))}
                     </div>
                     {upsellItems.length > 0 && (
                       <div className="mt-8 animate-fade-in">
                          <h3 className="font-bold text-gray-800 text-sm mb-3 pl-1 flex items-center gap-1">{t.addToOrder} <span className="text-lg">😋</span></h3>
                          <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar snap-x">
                             {upsellItems.map(item => (
                               <div key={item.id} className="min-w-[130px] w-[130px] bg-white p-2 rounded-xl border border-gray-100 shadow-sm snap-start flex flex-col hover:shadow-md transition-shadow">
                                  <div className="h-24 w-full rounded-lg overflow-hidden mb-2 bg-gray-50 relative">
                                     <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                     <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md text-[10px] font-bold text-gray-700 shadow-sm">{item.time}</div>
                                  </div>
                                  <p className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{item.name}</p>
                                  <div className="mt-auto flex items-center justify-between">
                                     <span className="text-xs font-bold text-rose-600">{item.price}₸</span>
                                     <button onClick={() => onAdd(item)} className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shadow-sm"><Plus className="w-3.5 h-3.5" /></button>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                     )}
                    </>
                  )}
                </div>
             )}

             {step === 'payment' && (
                <div className="p-5 animate-slide-in-right">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{t.paymentMethod}</h3>
                    <div className="space-y-3">
                        <button onClick={() => setPaymentMethod('card')} className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${paymentMethod === 'card' ? 'border-rose-500 bg-rose-50 shadow-sm ring-1 ring-rose-500' : 'border-gray-200 bg-white hover:border-rose-200'}`}>
                            <div className={`p-2 rounded-full ${paymentMethod === 'card' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500'}`}><CreditCard className="w-6 h-6" /></div>
                            <div className="text-left flex-1">
                                <p className={`font-bold text-sm ${paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-700'}`}>{t.card}</p>
                            </div>
                            {paymentMethod === 'card' && <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                        </button>

                        <button onClick={() => setPaymentMethod('apple_pay')} className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${paymentMethod === 'apple_pay' ? 'border-rose-500 bg-rose-50 shadow-sm ring-1 ring-rose-500' : 'border-gray-200 bg-white hover:border-rose-200'}`}>
                            <div className={`p-2 rounded-full ${paymentMethod === 'apple_pay' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}><Smartphone className="w-6 h-6" /></div>
                            <div className="text-left flex-1">
                                <p className={`font-bold text-sm ${paymentMethod === 'apple_pay' ? 'text-gray-900' : 'text-gray-700'}`}>{t.applePay}</p>
                                <p className="text-xs text-gray-400">{t.fastPay}</p>
                            </div>
                             {paymentMethod === 'apple_pay' && <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                        </button>

                         <button onClick={() => setPaymentMethod('cash')} className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${paymentMethod === 'cash' ? 'border-rose-500 bg-rose-50 shadow-sm ring-1 ring-rose-500' : 'border-gray-200 bg-white hover:border-rose-200'}`}>
                            <div className={`p-2 rounded-full ${paymentMethod === 'cash' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}><Banknote className="w-6 h-6" /></div>
                            <div className="text-left flex-1">
                                <p className={`font-bold text-sm ${paymentMethod === 'cash' ? 'text-gray-900' : 'text-gray-700'}`}>{t.cash}</p>
                                <p className="text-xs text-gray-400">{t.cashDesc}</p>
                            </div>
                             {paymentMethod === 'cash' && <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                        </button>
                    </div>

                    <div className="mt-8 bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm text-gray-500"><span>{t.orderTotal}</span><span>{cartTotal}₸</span></div>
                        <div className="flex justify-between text-sm text-gray-500"><span>{t.service}</span><span>0₸</span></div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between text-lg font-bold text-gray-900"><span>{t.total}</span><span>{cartTotal}₸</span></div>
                    </div>
                </div>
             )}

             {step === 'success' && (
                 <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                     <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                             <CheckCircle className="w-10 h-10 text-green-500" />
                         </div>
                     </div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.orderPaid}</h2>
                     <p className="text-gray-500 mb-8">{t.successDesc}</p>
                     
                     <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-8">
                         <div className="flex justify-between text-sm mb-2">
                             <span className="text-gray-500">{t.orderNum}</span>
                             <span className="font-mono font-bold text-gray-900">#{generatedOrderId}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-500">{t.total}</span>
                             <span className="font-bold text-gray-900">{cartTotal}₸</span>
                         </div>
                     </div>

                     <button 
                        onClick={() => onOrderSuccess && onOrderSuccess(generatedOrderId)}
                        className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold shadow-lg active:scale-95 transition-all"
                     >
                        {t.excellent}
                     </button>
                 </div>
             )}
          </div>
          
          {step !== 'success' && (
              <div className="p-5 border-t border-gray-100 bg-white pb-8 space-y-4 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-10">
                {step === 'cart' && cart.length > 0 && (
                    <>
                    <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-3">
                        <div className="flex items-center gap-2 text-rose-700 text-sm font-bold uppercase tracking-wide">
                            {orderMode === 'dine-in' && <><Utensils className="w-4 h-4" /> {t.yourTable}</>}
                            {orderMode === 'takeaway' && <><Footprints className="w-4 h-4" /> {t.takeaway}</>}
                            {orderMode === 'delivery' && <><Bike className="w-4 h-4" /> {t.address}</>}
                        </div>
                        
                        {orderMode === 'dine-in' && (
                            <input type="number" placeholder={t.tablePlaceholder} value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full bg-white border border-rose-200 rounded-xl h-11 px-4 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all placeholder:text-gray-400 font-medium text-gray-800" />
                        )}
                        
                        {orderMode === 'takeaway' && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider ml-1 opacity-80">{t.timeReady}:</p>
                                <div className="relative">
                                    <select 
                                        value={deliveryDetails} 
                                        onChange={(e) => setDeliveryDetails(e.target.value)} 
                                        className="w-full appearance-none bg-white border border-rose-200 text-gray-800 py-3 px-4 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all font-bold text-sm shadow-sm"
                                    >
                                        <option value="Как можно скорее">{t.asap}</option>
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-rose-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {orderMode === 'delivery' && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1 group">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                        <input 
                                            type="text" 
                                            placeholder={t.addressPlaceholder}
                                            value={deliveryDetails} 
                                            onChange={(e) => setDeliveryDetails(e.target.value)} 
                                            className="w-full bg-white border border-gray-200 rounded-xl h-10 pl-9 pr-10 text-xs font-medium outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-gray-400 text-gray-800" 
                                        />
                                         <button 
                                            onClick={() => setIsMapOpen(true)}
                                            className="absolute right-1 top-1 bottom-1 w-8 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                                            title={t.mapBtn}
                                        >
                                            <Navigation className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="relative group">
                                     <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                    <textarea 
                                        placeholder={t.commentPlaceholder}
                                        value={deliveryExtra.comment} 
                                        onChange={(e) => setDeliveryExtra({...deliveryExtra, comment: e.target.value})} 
                                        className="w-full bg-white border border-gray-200 rounded-xl h-16 py-3 pl-9 pr-3 text-xs font-medium outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-gray-400 text-gray-800 resize-none" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-2"><span>{t.total}</span><span>{cartTotal}₸</span></div>
                    
                    <button 
                        onClick={handleCheckout}
                        disabled={!isValid}
                        className={`w-full py-4 rounded-2xl ${THEME.gradient} text-white font-bold shadow-lg shadow-rose-200 active:scale-95 transition-all hover:shadow-xl hover:shadow-rose-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {!isValid ? (orderMode === 'dine-in' ? t.fillTable : t.fillAddress) : t.toPay}
                    </button>
                    
                    <button onClick={onClose} className="w-full py-3.5 rounded-2xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> {t.returnToShop}
                    </button>
                    </>
                )}

                {step === 'payment' && (
                    <>
                        <button 
                            onClick={handlePay}
                            disabled={isProcessing}
                            className={`w-full py-4 rounded-2xl ${THEME.gradient} text-white font-bold shadow-lg shadow-rose-200 active:scale-95 transition-all hover:shadow-xl hover:shadow-rose-300 flex items-center justify-center gap-2`}
                        >
                            {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> {t.processing}</> : `${t.pay} ${cartTotal}₸`}
                        </button>
                        <button 
                            onClick={() => setStep('cart')}
                            disabled={isProcessing}
                            className="w-full py-3.5 rounded-2xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center gap-2"
                        >
                            {t.back}
                        </button>
                    </>
                )}
              </div>
          )}
       </div>
    </div>
  );
};

export default CartModal;