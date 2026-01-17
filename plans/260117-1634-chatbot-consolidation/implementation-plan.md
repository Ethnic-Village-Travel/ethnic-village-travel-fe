# Chatbot Consolidation: V2 + V3 Merge

**Date:** 2026-01-17
**Status:** Planning
**Goal:** Merge V3 UI features with V2 auth logic into single consolidated chatbot component

---

## Executive Summary

| Aspect | V2 (Current Production) | V3 (Enhanced UI) | Consolidated |
|--------|------------------------|------------------|--------------|
| Auth | Bearer token from useAuthStore | Missing | V2 auth |
| Markdown | Basic URL regex | ReactMarkdown + syntax highlighting | V3 |
| Input | Single-line input | TextareaAutosize multiline | V3 |
| Animations | CSS only | Framer Motion | V3 |
| Actions | None | Copy, regenerate | V3 |
| Toast | None | Sonner | V3 |
| Badge | None | Unread count | V3 |
| Keyboard | Enter only | Escape close, Shift+Enter newline | V3 |

---

## Target Structure

```
src/components/shared/chatbot/
├── index.tsx              # Main component (entry point)
├── chatbot-window.tsx     # Window container + header
├── chatbot-trigger.tsx    # FAB button with badge
├── chatbot-message.tsx    # Message bubble with actions
├── chatbot-input.tsx      # Textarea input with char count
├── chatbot-header.tsx     # Header with session + actions
├── hooks/
│   └── use-chatbot.ts     # Chat logic + API calls
├── types.ts               # All type definitions
└── config.ts              # Default config + position helper
```

---

## Phase 1: Create Type Definitions

### File: `types.ts`

```typescript
// Re-export existing types from chatbot_v2
export type {
  Message,
  CacheData,
  ChatRequest,
  ChatResponse
} from '../chatbot_v2/types';

// New unified config type
export type ChatbotConfig = {
  apiUrl: string;
  title: string;
  placeholder: string;
  welcomeMessage: string;
  errorMessage: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: {
    primaryColor: string;       // Tailwind class: 'bg-emerald-600'
    textColor: string;
    backgroundColor: string;
    borderColor: string;
  };
  sessionConfig: {
    maxMessages: number;
    storageKey: string;
  };
  suggestions: string[];        // Quick action suggestions
};

export type ChatbotState = {
  isOpen: boolean;
  inputValue: string;
  isWaitingResponse: boolean;
  showTypingIndicator: boolean;
  apiError: string | null;
  unreadCount: number;
  copiedMessageIndex: number | null;
};
```

---

## Phase 2: Create Config

### File: `config.ts`

Port from V3 config (`chatbot-config-v3.ts:1-52`) with merged storage key:

```typescript
import type { ChatbotConfig } from './types';

export const defaultChatbotConfig: ChatbotConfig = {
  apiUrl: process.env.NEXT_PUBLIC_CHATBOT_V2_API_URL || 'http://localhost:8000/api',
  title: 'Tro ly Du lich AI',
  placeholder: 'Hoi ve tour du lich lang dan toc...',
  welcomeMessage: '...', // Same as V2/V3
  errorMessage: '...', // Same as V2/V3
  position: 'bottom-right',
  theme: {
    primaryColor: 'bg-emerald-600',
    textColor: 'text-gray-800',
    backgroundColor: 'bg-white',
    borderColor: 'border-gray-200',
  },
  sessionConfig: {
    maxMessages: 50,
    storageKey: 'chatbot_session', // Unified key
  },
  suggestions: ['Tim tour mien nui', 'Van hoa Tay', 'Dat tour 4 nguoi'],
};

export const getChatbotPosition = (position: ChatbotConfig['position']): string => {
  const positions = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };
  return positions[position] || positions['bottom-right'];
};
```

---

## Phase 3: Create Hook (Critical - Contains Auth)

### File: `hooks/use-chatbot.ts`

**Port V2 auth logic from lines 32-33, 99-108:**

```typescript
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';      // CRITICAL: V2 auth
import { useChatSession } from '@/stores/useChatSession';
import logger from '@/libs/logger';
import { toast } from 'sonner';
import type { ChatbotConfig, ChatbotState, ChatRequest, ChatResponse, Message } from '../types';

type UseChatbotOptions = {
  config: ChatbotConfig;
};

type UseChatbotReturn = {
  // State
  state: ChatbotState;
  sessionId: string | null;
  messages: Message[];
  isLoading: boolean;

  // Actions
  setIsOpen: (open: boolean) => void;
  setInputValue: (value: string) => void;
  sendMessage: (retryMessage?: string) => Promise<void>;
  handleReset: () => Promise<void>;
  handleCopy: (content: string, index: number) => Promise<void>;
  handleRegenerate: () => void;

  // Refs
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
};

export const useChatbot = ({ config }: UseChatbotOptions): UseChatbotReturn => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);

  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageCountRef = useRef(0);

  // Session hook
  const { sessionId, messages, cache, isLoading, addMessage, updateCache, clearMessages } =
    useChatSession(config.sessionConfig.storageKey, config.sessionConfig.maxMessages);

  // CRITICAL: V2 Auth integration (lines 32-33 from chatbot-v2.tsx)
  const { accessToken, isAuthenticated } = useAuthStore();

  // Health check (V2 lines 46-60, V3 lines 94-108)
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/health`);
        if (!response.ok) setApiError('API khong kha dung');
      } catch (error) {
        logger.error('Health check failed:', error);
        setApiError('Khong the ket noi API');
      }
    };
    checkHealth();
  }, [config.apiUrl]);

  // Send message with V2 auth (CRITICAL: lines 99-114 from chatbot-v2.tsx)
  const sendMessage = useCallback(async (retryMessage?: string) => {
    const messageToSend = retryMessage || inputValue.trim();
    if (isWaitingResponse || messageToSend === '' || !config.apiUrl) return;

    if (!retryMessage) {
      addMessage({ role: 'user', content: messageToSend, timestamp: Date.now() });
      setInputValue('');
    }

    setIsWaitingResponse(true);
    setShowTypingIndicator(true);
    setApiError(null);

    try {
      const history = messages.map(msg => ({ role: msg.role, content: msg.content }));

      const requestBody: ChatRequest = {
        message: messageToSend,
        session_id: sessionId || undefined,
        history,
        cache,
      };

      // CRITICAL V2 AUTH: Build headers with Bearer token (lines 99-108)
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isAuthenticated && accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${config.apiUrl}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data: ChatResponse = await response.json();
      setShowTypingIndicator(false);

      addMessage({ role: 'assistant', content: data.response, timestamp: Date.now() });
      if (data.cache) updateCache(data.cache);

      toast.success('Da nhan phan hoi tu AI');
    } catch (error) {
      logger.error('Chatbot error:', error);
      setShowTypingIndicator(false);
      setApiError(config.errorMessage);
      addMessage({ role: 'assistant', content: config.errorMessage, timestamp: Date.now() });
      toast.error('Khong the ket noi voi AI');
    } finally {
      setIsWaitingResponse(false);
    }
  }, [inputValue, isWaitingResponse, config, messages, sessionId, cache, isAuthenticated, accessToken, addMessage, updateCache]);

  // Reset handler (V3 lines 189-207)
  const handleReset = useCallback(async () => {
    if (!confirm('Ban co chac muon xoa toan bo lich su chat?')) return;

    try {
      if (sessionId) {
        await fetch(`${config.apiUrl}/chat/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }
      clearMessages();
      setApiError(null);
      toast.success('Da xoa lich su chat');
    } catch (error) {
      logger.error('Failed to reset chat:', error);
      toast.error('Khong the xoa lich su');
    }
  }, [sessionId, config.apiUrl, clearMessages]);

  // Copy handler (V3 lines 209-218)
  const handleCopy = useCallback(async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageIndex(index);
      toast.success('Da sao chep tin nhan');
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch {
      toast.error('Khong the sao chep');
    }
  }, []);

  // Regenerate handler (V3 lines 220-232)
  const handleRegenerate = useCallback(() => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage) {
      const updatedMessages = messages.slice(0, -1);
      clearMessages();
      updatedMessages.forEach(msg => addMessage(msg));
      sendMessage(lastUserMessage.content);
      toast.info('Dang tao lai phan hoi...');
    }
  }, [messages, clearMessages, addMessage, sendMessage]);

  // Auto-scroll (V3 lines 53-61)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, showTypingIndicator, isOpen]);

  // Unread count tracking (V3 lines 63-75)
  useEffect(() => {
    if (!isOpen && messages.length > lastMessageCountRef.current) {
      setUnreadCount(prev => prev + (messages.length - lastMessageCountRef.current));
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  // Auto-focus input (V3 lines 77-81)
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  // Escape key handler (V3 lines 83-92)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return {
    state: {
      isOpen,
      inputValue,
      isWaitingResponse,
      showTypingIndicator,
      apiError,
      unreadCount,
      copiedMessageIndex,
    },
    sessionId,
    messages,
    isLoading,
    setIsOpen,
    setInputValue,
    sendMessage,
    handleReset,
    handleCopy,
    handleRegenerate,
    messagesContainerRef,
    inputRef,
  };
};
```

---

## Phase 4: Create UI Components

### 4.1 `chatbot-trigger.tsx` (V3 lines 293-319)

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import type { ChatbotConfig } from './types';

type ChatbotTriggerProps = {
  isOpen: boolean;
  unreadCount: number;
  onOpen: () => void;
  theme: ChatbotConfig['theme'];
};

export const ChatbotTrigger = ({ isOpen, unreadCount, onOpen, theme }: ChatbotTriggerProps) => {
  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        className={`group relative rounded-full p-4 text-white shadow-lg ${theme.primaryColor}`}
        aria-label="Mo chatbot"
      >
        <MessageCircle size={24} className="relative z-10" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
        <Sparkles size={12} className="absolute right-3 top-3 animate-pulse opacity-0 group-hover:opacity-100" />
      </motion.button>
    </AnimatePresence>
  );
};
```

### 4.2 `chatbot-header.tsx` (V3 lines 333-367)

```typescript
'use client';

import { motion } from 'framer-motion';
import { MessageCircle, RotateCcw, X } from 'lucide-react';
import type { ChatbotConfig } from './types';

type ChatbotHeaderProps = {
  title: string;
  sessionId: string | null;
  theme: ChatbotConfig['theme'];
  onReset: () => void;
  onClose: () => void;
};

export const ChatbotHeader = ({ title, sessionId, theme, onReset, onClose }: ChatbotHeaderProps) => (
  <div className={`${theme.primaryColor} flex items-center justify-between rounded-t-lg p-4 text-white shadow-md`}>
    <div className="flex items-center space-x-2">
      <div className="relative">
        <MessageCircle size={20} />
        <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-green-300" />
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {sessionId && <p className="text-xs text-emerald-100">Session: {sessionId.slice(0, 8)}...</p>}
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onReset} className="rounded p-1 hover:bg-emerald-700" title="Xoa lich su">
        <RotateCcw size={16} />
      </motion.button>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="rounded p-1 hover:bg-emerald-700">
        <X size={20} />
      </motion.button>
    </div>
  </div>
);
```

### 4.3 `chatbot-message.tsx` (V3 lines 416-487)

```typescript
'use client';

import { motion } from 'framer-motion';
import { Bot, User, Copy, RefreshCw, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { Message } from './types';

type ChatbotMessageProps = {
  message: Message;
  index: number;
  isLast: boolean;
  copiedIndex: number | null;
  isWaiting: boolean;
  onCopy: (content: string, index: number) => void;
  onRegenerate: () => void;
};

const markdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" className="rounded-md text-sm" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-800" {...props}>{children}</code>
    );
  },
  a({ node, children, ...props }: any) {
    return <a className="break-all text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  },
};

export const ChatbotMessage = ({ message, index, isLast, copiedIndex, isWaiting, onCopy, onRegenerate }: ChatbotMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div className={`flex h-8 min-w-8 items-center justify-center rounded-full text-white shadow-md ${
        isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className="flex max-w-[75%] flex-col">
        <div className={`rounded-lg p-3 shadow-sm ${
          isUser ? 'rounded-tr-none bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'rounded-tl-none border border-gray-200 bg-white text-gray-800'
        }`}>
          {!isUser ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between px-1">
          <p className={`text-xs ${isUser ? 'text-blue-400' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
            <motion.button whileHover={{ scale: 1.1 }} onClick={() => onCopy(message.content, index)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
              {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
            </motion.button>
            {!isUser && isLast && (
              <motion.button whileHover={{ scale: 1.1 }} onClick={onRegenerate} disabled={isWaiting} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                <RefreshCw size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
```

### 4.4 `chatbot-input.tsx` (V3 lines 494-520)

```typescript
'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import type { ChatbotConfig } from './types';

type ChatbotInputProps = {
  value: string;
  isWaiting: boolean;
  isLoading: boolean;
  placeholder: string;
  theme: ChatbotConfig['theme'];
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const ChatbotInput = forwardRef<HTMLTextAreaElement, ChatbotInputProps>(
  ({ value, isWaiting, isLoading, placeholder, theme, onChange, onSend, onKeyDown }, ref) => (
    <div className="rounded-b-lg border-t border-gray-200 bg-white p-4">
      <div className="flex space-x-2">
        <TextareaAutosize
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="max-h-32 min-h-[40px] flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          disabled={isWaiting || isLoading}
          minRows={1}
          maxRows={4}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          disabled={isWaiting || value.trim() === '' || isLoading}
          className={`${theme.primaryColor} flex h-10 w-10 items-center justify-center self-end rounded-lg text-white shadow-md disabled:bg-gray-400`}
        >
          {isWaiting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </motion.button>
      </div>
      <p className="mt-1 text-right text-xs text-gray-400">
        {value.length}/2000 <kbd className="rounded bg-gray-100 px-1">Shift+Enter</kbd> de xuong dong
      </p>
    </div>
  )
);

ChatbotInput.displayName = 'ChatbotInput';
```

### 4.5 `chatbot-window.tsx` (Container combining above)

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Bot } from 'lucide-react';
import type { ChatbotConfig, Message } from './types';
import { ChatbotHeader } from './chatbot-header';
import { ChatbotMessage } from './chatbot-message';
import { ChatbotInput } from './chatbot-input';

type TypingIndicatorProps = {};

const TypingIndicator = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start space-x-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
      <Bot size={16} />
    </div>
    <div className="flex items-center space-x-1 rounded-lg rounded-tl-none border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex space-x-1">
        {[0, 0.1, 0.2].map((delay, i) => (
          <div key={i} className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: `${delay}s` }} />
        ))}
      </div>
      <span className="ml-2 text-xs text-gray-500">AI dang tra loi...</span>
    </div>
  </motion.div>
);

type ChatbotWindowProps = {
  isOpen: boolean;
  config: ChatbotConfig;
  sessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  isWaitingResponse: boolean;
  showTypingIndicator: boolean;
  apiError: string | null;
  copiedMessageIndex: number | null;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  onClose: () => void;
  onReset: () => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onCopy: (content: string, index: number) => void;
  onRegenerate: () => void;
};

export const ChatbotWindow = ({
  isOpen,
  config,
  sessionId,
  messages,
  isLoading,
  inputValue,
  isWaitingResponse,
  showTypingIndicator,
  apiError,
  copiedMessageIndex,
  messagesContainerRef,
  inputRef,
  onClose,
  onReset,
  onInputChange,
  onSend,
  onCopy,
  onRegenerate,
}: ChatbotWindowProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isWaitingResponse) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`${config.theme.backgroundColor} ${config.theme.borderColor} flex flex-col rounded-lg border shadow-2xl h-[600px] w-[400px] max-sm:fixed max-sm:inset-4 max-sm:h-auto max-sm:w-auto`}
        >
          <ChatbotHeader
            title={config.title}
            sessionId={sessionId}
            theme={config.theme}
            onReset={onReset}
            onClose={onClose}
          />

          {apiError && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-b border-red-200 bg-red-50 p-2 text-center">
              <p className="text-xs text-red-600">{apiError}</p>
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex flex-1 items-center justify-center bg-gray-50">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4">
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                    <Bot size={32} />
                  </div>
                  <p className="whitespace-pre-line px-4 text-sm text-gray-600">{config.welcomeMessage}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
                    {config.suggestions.map((suggestion, i) => (
                      <motion.button key={i} whileHover={{ scale: 1.05 }} onClick={() => onInputChange(suggestion)} className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50">
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <ChatbotMessage
                    key={idx}
                    message={msg}
                    index={idx}
                    isLast={idx === messages.length - 1}
                    copiedIndex={copiedMessageIndex}
                    isWaiting={isWaitingResponse}
                    onCopy={onCopy}
                    onRegenerate={onRegenerate}
                  />
                ))}
              </AnimatePresence>

              {showTypingIndicator && <TypingIndicator />}
            </div>
          )}

          <ChatbotInput
            ref={inputRef}
            value={inputValue}
            isWaiting={isWaitingResponse}
            isLoading={isLoading}
            placeholder={config.placeholder}
            theme={config.theme}
            onChange={onInputChange}
            onSend={onSend}
            onKeyDown={handleKeyDown}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### 4.6 `index.tsx` (Main Entry Point)

```typescript
'use client';

import { Toaster } from 'sonner';
import { useChatbot } from './hooks/use-chatbot';
import { ChatbotTrigger } from './chatbot-trigger';
import { ChatbotWindow } from './chatbot-window';
import { defaultChatbotConfig, getChatbotPosition } from './config';
import type { ChatbotConfig } from './types';

type ChatbotProps = {
  config?: Partial<ChatbotConfig>;
};

export const Chatbot = ({ config: userConfig = {} }: ChatbotProps) => {
  const config = { ...defaultChatbotConfig, ...userConfig };

  const {
    state,
    sessionId,
    messages,
    isLoading,
    setIsOpen,
    setInputValue,
    sendMessage,
    handleReset,
    handleCopy,
    handleRegenerate,
    messagesContainerRef,
    inputRef,
  } = useChatbot({ config });

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className={`fixed ${getChatbotPosition(config.position)} z-50`}>
        <ChatbotTrigger
          isOpen={state.isOpen}
          unreadCount={state.unreadCount}
          onOpen={() => setIsOpen(true)}
          theme={config.theme}
        />
        <ChatbotWindow
          isOpen={state.isOpen}
          config={config}
          sessionId={sessionId}
          messages={messages}
          isLoading={isLoading}
          inputValue={state.inputValue}
          isWaitingResponse={state.isWaitingResponse}
          showTypingIndicator={state.showTypingIndicator}
          apiError={state.apiError}
          copiedMessageIndex={state.copiedMessageIndex}
          messagesContainerRef={messagesContainerRef}
          inputRef={inputRef}
          onClose={() => setIsOpen(false)}
          onReset={handleReset}
          onInputChange={setInputValue}
          onSend={() => sendMessage()}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
        />
      </div>
    </>
  );
};

export default Chatbot;
export { defaultChatbotConfig } from './config';
export type { ChatbotConfig, Message } from './types';
```

---

## Phase 5: Migration

### 5.1 Update Marketing Layout

**File:** `src/app/[locale]/(marketing)/layout.tsx`

```diff
- import dynamic from 'next/dynamic';
- const ChatbotV2 = dynamic(() => import('@/components/shared/chatbot_v2').then(mod => ({ default: mod.ChatbotV2 })));
+ import dynamic from 'next/dynamic';
+ const Chatbot = dynamic(() => import('@/components/shared/chatbot'));

// In JSX:
- <ChatbotV2 />
+ <Chatbot />
```

### 5.2 Session Data Migration (Optional)

Existing users may have data in `chatbot_v2_session`. Consider auto-migration or clear:

```typescript
// In useChatSession or during first load
const migrateOldSession = () => {
  const oldMessages = localStorage.getItem('chatbot_v2_session_messages');
  if (oldMessages && !localStorage.getItem('chatbot_session_messages')) {
    localStorage.setItem('chatbot_session_messages', oldMessages);
    localStorage.removeItem('chatbot_v2_session_messages');
  }
};
```

---

## Phase 6: Cleanup

### Files to Delete

1. `src/components/shared/chatbot_v2/chatbot-v2.tsx`
2. `src/components/shared/chatbot_v2/chatbot-v3.tsx`
3. `src/components/shared/chatbot_v2/chatbot-config-v2.ts`
4. `src/components/shared/chatbot_v2/chatbot-config-v3.ts`
5. `src/components/shared/chatbot_v2/index.ts` (update to re-export from new location)

### Keep

1. `src/components/shared/chatbot_v2/types.ts` -> Move to new `chatbot/types.ts`
2. `src/stores/useChatSession.ts` -> Keep as-is
3. `src/styles/chatbot.css` -> Keep as-is

### Update Index

New `src/components/shared/chatbot_v2/index.ts` (temporary redirect):

```typescript
export { Chatbot, Chatbot as ChatbotV2, Chatbot as ChatbotV3 } from '../chatbot';
export type { ChatbotConfig, ChatbotConfig as ChatbotV2Config, ChatbotConfig as ChatbotV3Config } from '../chatbot';
```

---

## Implementation Checklist

| Step | Task | Est. Time |
|------|------|-----------|
| 1 | Create `chatbot/types.ts` | 5 min |
| 2 | Create `chatbot/config.ts` | 5 min |
| 3 | Create `chatbot/hooks/use-chatbot.ts` (CRITICAL: V2 auth) | 20 min |
| 4 | Create `chatbot/chatbot-trigger.tsx` | 5 min |
| 5 | Create `chatbot/chatbot-header.tsx` | 5 min |
| 6 | Create `chatbot/chatbot-message.tsx` | 10 min |
| 7 | Create `chatbot/chatbot-input.tsx` | 5 min |
| 8 | Create `chatbot/chatbot-window.tsx` | 10 min |
| 9 | Create `chatbot/index.tsx` | 5 min |
| 10 | Update marketing layout | 2 min |
| 11 | Test auth flow (logged in/out) | 10 min |
| 12 | Delete old files | 5 min |
| **Total** | | **~90 min** |

---

## Testing Checklist

- [ ] Chatbot opens/closes with animation
- [ ] Messages send and receive
- [ ] Markdown renders correctly (code blocks, links)
- [ ] Copy message works
- [ ] Regenerate response works
- [ ] Reset clears history
- [ ] Unread badge shows when closed
- [ ] Escape key closes chatbot
- [ ] Shift+Enter creates newline
- [ ] **CRITICAL: Logged-in user sends Bearer token**
- [ ] **CRITICAL: Logged-out user works without token**
- [ ] Session persists across page refresh
- [ ] Mobile responsive layout

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Auth token not sent | High | Test with network tab open, verify Authorization header |
| Session storage key change | Medium | Migrate old data or accept fresh start |
| Framer Motion bundle size | Low | Already using in V3, no change |
| sonner toast conflicts | Low | Toaster in component, position top-center |

---

## Unresolved Questions

1. Should old session data (`chatbot_v2_session`) be auto-migrated?
2. Should we add i18n support for chatbot strings?
3. Should config use environment variables for suggestions?
