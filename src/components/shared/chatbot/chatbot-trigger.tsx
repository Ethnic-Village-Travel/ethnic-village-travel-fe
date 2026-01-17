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

/**
 * Floating action button to open chatbot
 * Shows unread message badge when closed
 */
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
        aria-label="Mở chatbot"
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
        <Sparkles
          size={12}
          className="absolute right-3 top-3 animate-pulse opacity-0 group-hover:opacity-100"
        />
      </motion.button>
    </AnimatePresence>
  );
};
