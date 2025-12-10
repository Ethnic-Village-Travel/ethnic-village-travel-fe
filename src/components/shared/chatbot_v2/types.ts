/**
 * TypeScript types matching FastAPI Pydantic models from main.py
 */

export interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface CacheData {
  tour_list?: {
    tours: any[];
    query: string;
    count: number;
  } | null;
  available_dates?: {
    tour_id: string;
    tour_name: string;
    dates: any[];
    count: number;
  } | null;
  booking_info?: {
    booking_id: string;
    tour_id: string;
    tour_name: string;
    departure_date: string;
    adults: number;
    children: number;
    total_price: number;
    status: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  } | null;
  payment_link?: {
    checkout_url: string;
    expires_at: string;
  } | null;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  history?: MessageItem[];
  cache?: CacheData;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  cache: CacheData;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  history: ChatHistoryItem[];
  count: number;
}

export interface SessionResponse {
  session_id: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  version: string;
}

/**
 * Frontend message type for UI display
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Session storage structure for localStorage
 */
export interface ChatSession {
  session_id: string;
  messages: Message[];
  last_updated: number;
}
