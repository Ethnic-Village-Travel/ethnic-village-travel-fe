'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import logger from '@/libs/logger';
import { useAuthStore } from '@/stores/useAuthStore'; // CRITICAL: V2 auth integration
import { useChatSession } from '@/stores/useChatSession';

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
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
};

/**
 * Custom hook for chatbot functionality
 * Merges V2 auth logic with V3 UI features
 */
export const useChatbot = ({ config }: UseChatbotOptions): UseChatbotReturn => {
  // State management
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
  const { sessionId, messages, cache, isLoading, addMessage, updateCache, clearMessages } = useChatSession(
    config.sessionConfig.storageKey,
    config.sessionConfig.maxMessages,
  );

  // CRITICAL: V2 Auth integration - get token from store
  const { accessToken, isAuthenticated } = useAuthStore();

  // Health check on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/health`);
        if (!response.ok) setApiError('API không khả dụng');
      } catch (error) {
        logger.error('Health check failed:', error);
        setApiError('Không thể kết nối API');
      }
    };
    checkHealth();
  }, [config.apiUrl]);

  // Send message with V2 auth (CRITICAL: includes Bearer token)
  const sendMessage = useCallback(
    async (retryMessage?: string) => {
      const messageToSend = retryMessage || inputValue.trim();
      if (isWaitingResponse || messageToSend === '' || !config.apiUrl) return;

      // Add user message if not retrying
      if (!retryMessage) {
        addMessage({ role: 'user', content: messageToSend, timestamp: Date.now() });
        setInputValue('');
      }

      setIsWaitingResponse(true);
      setShowTypingIndicator(true);
      setApiError(null);

      try {
        const history = messages.map((msg) => ({ role: msg.role, content: msg.content }));

        const requestBody: ChatRequest = {
          message: messageToSend,
          session_id: sessionId || undefined,
          history,
          cache,
        };

        // CRITICAL V2 AUTH: Build headers with Bearer token
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

        toast.success('Đã nhận phản hồi từ AI');
      } catch (error) {
        logger.error('Chatbot error:', error);
        setShowTypingIndicator(false);
        setApiError(config.errorMessage);
        addMessage({ role: 'assistant', content: config.errorMessage, timestamp: Date.now() });
        toast.error('Không thể kết nối với AI');
      } finally {
        setIsWaitingResponse(false);
      }
    },
    [inputValue, isWaitingResponse, config, messages, sessionId, cache, isAuthenticated, accessToken, addMessage, updateCache],
  );

  // Reset chat history
  const handleReset = useCallback(async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) return;

    try {
      if (sessionId) {
        await fetch(`${config.apiUrl}/chat/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }
      clearMessages();
      setApiError(null);
      toast.success('Đã xóa lịch sử chat');
    } catch (error) {
      logger.error('Failed to reset chat:', error);
      toast.error('Không thể xóa lịch sử');
    }
  }, [sessionId, config.apiUrl, clearMessages]);

  // Copy message to clipboard
  const handleCopy = useCallback(async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageIndex(index);
      toast.success('Đã sao chép tin nhắn');
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch {
      toast.error('Không thể sao chép');
    }
  }, []);

  // Regenerate last response
  const handleRegenerate = useCallback(() => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user');
    if (lastUserMessage) {
      const updatedMessages = messages.slice(0, -1);
      clearMessages();
      updatedMessages.forEach((msg) => addMessage(msg));
      sendMessage(lastUserMessage.content);
      toast.info('Đang tạo lại phản hồi...');
    }
  }, [messages, clearMessages, addMessage, sendMessage]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, showTypingIndicator, isOpen]);

  // Track unread messages
  useEffect(() => {
    if (!isOpen && messages.length > lastMessageCountRef.current) {
      setUnreadCount((prev) => prev + (messages.length - lastMessageCountRef.current));
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  // Escape key handler
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
