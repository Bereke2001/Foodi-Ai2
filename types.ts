
export type Language = 'ru' | 'en' | 'ar';

export interface Dish {
  id: string;
  name: string;
  price: number;
  time: string;
  img: string;
  desc: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface CartItem extends Dish {
  qty: number;
}

export interface Action {
  label: string;
  action: string;
  payload?: any;
}

export type OrderStatus = 'accepted' | 'cooking' | 'ready' | 'completed';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  mode: OrderMode;
  details: string; // Table number or address
  createdAt: number;
}

export interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  actions?: Action[] | null;
  dataType?: 'categories' | 'dishes' | 'text' | 'order_status';
  data?: any;
}

export type OrderMode = 'dine-in' | 'takeaway' | 'delivery';
