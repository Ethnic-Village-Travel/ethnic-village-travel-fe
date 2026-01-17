'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Bot } from 'lucide-react';

import type { ChatbotConfig, Message } from './types';
import { ChatbotHeader } from './chatbot-header';
import { ChatbotMessage } from './chatbot-message';
import { ChatbotInput } from './chatbot-input';

/**
 * Typing indicator component
 */
const TypingIndicator = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start space-x-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
      <Bot size={16} />
    </div>
    <div className="flex items-center space-x-1 rounded-lg rounded-tl-none border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex space-x-1">
        {[0, 0.1, 0.2].map((delay, i) => (
          <div
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <span className="ml-2 text-xs text-gray-500">AI đang trả lời...</span>
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
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onClose: () => void;
  onReset: () => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onCopy: (content: string, index: number) => void;
  onRegenerate: () => void;
};

/**
 * Main chatbot window with messages and input
 */
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
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              className="border-b border-red-200 bg-red-50 p-2 text-center"
            >
              <p className="text-xs text-red-600">{apiError}</p>
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex flex-1 items-center justify-center bg-gray-50">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div
              ref={messagesContainerRef}
              className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4"
            >
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                    <Bot size={32} />
                  </div>
                  <p className="whitespace-pre-line px-4 text-sm text-gray-600">{config.welcomeMessage}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
                    {config.suggestions.map((suggestion, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onInputChange(suggestion)}
                        className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                      >
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
