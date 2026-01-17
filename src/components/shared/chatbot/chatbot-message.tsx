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

// Markdown component renderers with syntax highlighting
const markdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        className="rounded-md text-sm"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-800" {...props}>
        {children}
      </code>
    );
  },
  a({ node, children, ...props }: any) {
    return (
      <a
        className="break-all text-blue-500 underline hover:text-blue-700"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
};

/**
 * Individual message bubble with markdown support and actions
 */
export const ChatbotMessage = ({
  message,
  index,
  isLast,
  copiedIndex,
  isWaiting,
  onCopy,
  onRegenerate,
}: ChatbotMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div
        className={`flex h-8 min-w-8 items-center justify-center rounded-full text-white shadow-md ${
          isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className="flex max-w-[75%] flex-col">
        <div
          className={`rounded-lg p-3 shadow-sm ${
            isUser
              ? 'rounded-tr-none bg-gradient-to-br from-blue-500 to-blue-600 text-white'
              : 'rounded-tl-none border border-gray-200 bg-white text-gray-800'
          }`}
        >
          {!isUser ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onCopy(message.content, index)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
            >
              {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
            </motion.button>
            {!isUser && isLast && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={onRegenerate}
                disabled={isWaiting}
                className="rounded p-1 text-gray-400 hover:bg-gray-100"
              >
                <RefreshCw size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
