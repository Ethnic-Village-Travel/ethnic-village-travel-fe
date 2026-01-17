// Core message types
export type MessageItem = {
  role: 'user' | 'assistant';
  content: string;
};

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

// Cache data structure for chatbot context
export type CacheData = {
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
};

// API request/response types
export type ChatRequest = {
  message: string;
  session_id?: string;
  history?: MessageItem[];
  cache?: CacheData;
};

export type ChatResponse = {
  response: string;
  session_id: string;
  cache: CacheData;
};

export type ChatHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatHistoryResponse = {
  session_id: string;
  history: ChatHistoryItem[];
  count: number;
};

export type SessionResponse = {
  session_id: string;
  message: string;
};

export type HealthResponse = {
  status: string;
  version: string;
};

// Session storage type
export type ChatSession = {
  session_id: string;
  messages: Message[];
  last_updated: number;
};

// Unified chatbot config type
export type ChatbotConfig = {
  apiUrl: string;
  title: string;
  placeholder: string;
  welcomeMessage: string;
  errorMessage: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: {
    primaryColor: string;
    textColor: string;
    backgroundColor: string;
    borderColor: string;
  };
  sessionConfig: {
    maxMessages: number;
    storageKey: string;
  };
  suggestions: string[];
};

// Internal chatbot state type
export type ChatbotState = {
  isOpen: boolean;
  inputValue: string;
  isWaitingResponse: boolean;
  showTypingIndicator: boolean;
  apiError: string | null;
  unreadCount: number;
  copiedMessageIndex: number | null;
};
