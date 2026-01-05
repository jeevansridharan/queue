
export enum AppView {
  STUDENT_DASHBOARD = 'student_dash',
  STUDENT_XEROX = 'student_xerox',
  VENDOR_DASHBOARD = 'vendor_dash',
  AI_INSIGHTS = 'ai_insights',
  CHAT_SUPPORT = 'chat',
  AI_IMAGINE = 'imagine',
  AI_SEARCH = 'search',
  AI_VOICE = 'voice',
  PROFILE = 'profile'
}

export type UserRole = 'student' | 'canteen' | 'xerox';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export interface Order {
  id: string;
  type: 'canteen' | 'xerox';
  items: string;
  total: number;
  status: OrderStatus;
  pickupSlot: string;
  timestamp: number;
  studentName: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}
