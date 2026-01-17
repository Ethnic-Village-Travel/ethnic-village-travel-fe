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

/**
 * Multi-line input with auto-resize and character counter
 */
export const ChatbotInput = forwardRef<HTMLTextAreaElement, ChatbotInputProps>(
  ({ value, isWaiting, isLoading, placeholder, theme, onChange, onSend, onKeyDown }, ref) => (
    <div className="rounded-b-lg border-t border-gray-200 bg-white p-4">
      <div className="flex space-x-2">
        <TextareaAutosize
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
        {value.length}/2000 • <kbd className="rounded bg-gray-100 px-1">Shift+Enter</kbd> để xuống dòng
      </p>
    </div>
  ),
);

ChatbotInput.displayName = 'ChatbotInput';
