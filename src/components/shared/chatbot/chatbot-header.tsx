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

/**
 * Chatbot header with title, session info, and action buttons
 */
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
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onReset}
        className="rounded p-1 hover:bg-emerald-700"
        title="Xóa lịch sử"
      >
        <RotateCcw size={16} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="rounded p-1 hover:bg-emerald-700"
      >
        <X size={20} />
      </motion.button>
    </div>
  </div>
);
