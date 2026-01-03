'use client';

import { useCallback, useEffect, useState } from 'react';

import type { CacheData, ChatSession, Message } from '../components/shared/chatbot_v2/types';

type UseChatSessionReturn = {
  sessionId: string | null;
  messages: Message[];
  cache: CacheData;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  updateCache: (newCache: CacheData) => void;
  clearMessages: () => void;
  loadSession: () => void;
  saveSession: () => void;
}

/**
 * Generate UUID v4
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Get session ID from cookie
 */
const getSessionFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  const sessionCookie = cookies.find(c => c.startsWith('chatbot_session_id='));
  return sessionCookie ? sessionCookie.split('=')[1] : null;
};

/**
 * Save session ID to cookie (7 days expiry)
 */
const saveSessionToCookie = (sessionId: string): void => {
  if (typeof document === 'undefined') return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  document.cookie = `chatbot_session_id=${sessionId}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};

/**
 * Clear session cookie
 */
const clearSessionCookie = (): void => {
  if (typeof document === 'undefined') return;

  document.cookie = 'chatbot_session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

/**
 * Custom hook for managing chat session with localStorage persistence
 * - Session ID: Stored in cookie (UUID)
 * - Messages: Stored in localStorage (history)
 * - Cache: Stored in localStorage (tour data, booking info, etc.)
 */
export const useChatSession = (storageKey: string, maxMessages: number = 50): UseChatSessionReturn => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [cache, setCache] = useState<CacheData>({});
  const [isLoading, setIsLoading] = useState(true);

  const cacheStorageKey = `${storageKey}_cache`;
  const messagesStorageKey = `${storageKey}_messages`;

  // Load session from cookie and data from localStorage on mount
  const loadSession = useCallback(() => {
    setIsLoading(true);
    try {
      // Get or create session ID from cookie
      let currentSessionId = getSessionFromCookie();
      if (!currentSessionId) {
        currentSessionId = generateUUID();
        saveSessionToCookie(currentSessionId);
        console.log('Created new session:', currentSessionId);
      } else {
        console.log('Loaded session from cookie:', currentSessionId);
      }
      setSessionId(currentSessionId);

      // Load messages from localStorage
      const storedMessages = localStorage.getItem(messagesStorageKey);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed);
        console.log('Loaded', parsed.length, 'messages from localStorage');
      }

      // Load cache from localStorage
      const storedCache = localStorage.getItem(cacheStorageKey);
      if (storedCache) {
        const parsed = JSON.parse(storedCache);
        setCache(parsed);
        console.log('Loaded cache from localStorage:', Object.keys(parsed));
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messagesStorageKey, cacheStorageKey]);

  // Save messages to localStorage
  const saveSession = useCallback(() => {
    if (!sessionId) return;

    try {
      // Keep only last N messages to avoid localStorage quota issues
      const messagesToSave = messages.slice(-maxMessages);
      localStorage.setItem(messagesStorageKey, JSON.stringify(messagesToSave));
      console.log('Saved', messagesToSave.length, 'messages to localStorage');
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
      // If quota exceeded, try to save with fewer messages
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        try {
          const reducedMessages = messages.slice(-Math.floor(maxMessages / 2));
          localStorage.setItem(messagesStorageKey, JSON.stringify(reducedMessages));
          console.log('Saved messages with reduced count:', reducedMessages.length);
        } catch (retryError) {
          console.error('Failed to save even with reduced messages:', retryError);
        }
      }
    }
  }, [sessionId, messages, messagesStorageKey, maxMessages]);

  // Save cache to localStorage
  const saveCache = useCallback(() => {
    try {
      localStorage.setItem(cacheStorageKey, JSON.stringify(cache));
      console.log('Saved cache to localStorage:', Object.keys(cache));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }, [cache, cacheStorageKey]);

  // Add new message
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Update cache
  const updateCache = useCallback((newCache: CacheData) => {
    setCache(prev => ({ ...prev, ...newCache }));
  }, []);

  // Clear all messages, cache and create new session
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCache({});

    // Create new session ID
    const newSessionId = generateUUID();
    setSessionId(newSessionId);
    saveSessionToCookie(newSessionId);

    try {
      localStorage.removeItem(messagesStorageKey);
      localStorage.removeItem(cacheStorageKey);
      console.log('Cleared session, messages and cache. New session:', newSessionId);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, [messagesStorageKey, cacheStorageKey]);

  // Load session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Auto-save messages when they change
  useEffect(() => {
    if (messages.length > 0 && sessionId) {
      saveSession();
    }
  }, [messages, sessionId, saveSession]);

  // Auto-save cache when it changes
  useEffect(() => {
    if (Object.keys(cache).length > 0) {
      saveCache();
    }
  }, [cache, saveCache]);

  return {
    sessionId,
    messages,
    cache,
    isLoading,
    addMessage,
    updateCache,
    clearMessages,
    loadSession,
    saveSession,
  };
};
