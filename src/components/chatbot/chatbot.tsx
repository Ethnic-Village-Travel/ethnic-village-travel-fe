'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, User, X } from 'lucide-react';

import { useChatbotUser } from '@/hooks/useChatbotUser';

import { defaultChatbotConfig, getChatbotPosition, type ChatbotConfig } from './chatbot-config';

interface Message {
  user_id: string | null;
  message: string;
  timestamp: number;
}

interface ChatbotProps {
  config?: Partial<ChatbotConfig>;
}

const Chatbot: React.FC<ChatbotProps> = ({ config = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { userId, isGuest } = useChatbotUser();
  const chatbotConfig = { ...defaultChatbotConfig, ...config };

  const LOCAL_STORAGE_KEY = 'chatbot_messages';

  // Load messages from localStorage
  useEffect(() => {
    if (!userId) return;

    const allMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    const userMessages = allMessages[userId] || [];
    setMessages(userMessages);
    console.log('Loaded messages for user:', userId, userMessages); // Debug log
  }, [userId]);

  // Save messages to localStorage
  const saveMessages = (newMessages: Message[]) => {
    if (!userId) {
      console.log('Cannot save messages: userId is not available'); // Debug log
      return;
    }

    const allMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    allMessages[userId] = newMessages;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allMessages));
    console.log('Saved messages for user:', userId, newMessages); // Debug log
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  // Auto-save messages when messages change
  useEffect(() => {
    if (messages.length > 0 && userId) {
      saveMessages(messages);
    }
  }, [messages, userId]);

  // Add message
  const addMessage = (user_id: string | null, message: string) => {
    if (!userId) {
      console.log('Cannot add message: userId is not available'); // Debug log
      return;
    }

    const newMessage: Message = {
      user_id,
      message,
      timestamp: Date.now(),
    };

    console.log('Adding message:', newMessage); // Debug log

    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Send message to API
  const sendMessage = async () => {
    if (isWaitingResponse || inputValue.trim() === '' || !chatbotConfig.apiUrl || !userId) return;

    const userMessage = inputValue.trim();
    addMessage(userId, userMessage);
    setInputValue('');
    setIsWaitingResponse(true);
    setShowTypingIndicator(true);

    try {
      const response = await fetch(chatbotConfig.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();
      setShowTypingIndicator(false);
      addMessage(null, data.answer || 'Chatbot không có phản hồi.');
    } catch (error) {
      setShowTypingIndicator(false);
      addMessage(null, chatbotConfig.errorMessage);
      console.error('Chatbot error:', error);
    }

    setIsWaitingResponse(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isWaitingResponse) {
      sendMessage();
    }
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex items-start space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white">
        <Bot size={16} />
      </div>
      <div className="flex max-w-xs items-center space-x-1 rounded-lg rounded-tl-none border border-gray-200 bg-white p-3">
        <div className="flex space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className="ml-2 text-xs text-gray-500">Đang trả lời...</span>
      </div>
    </div>
  );

  return (
    <div className={`fixed ${getChatbotPosition(chatbotConfig.position)} z-50`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`${chatbotConfig.theme.primaryColor} rounded-full p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700`}
          aria-label="Mở chatbot"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className={`${chatbotConfig.theme.backgroundColor} rounded-lg border shadow-xl ${chatbotConfig.theme.borderColor} flex h-96 w-96 flex-col transition-all duration-300`}
        >
          {/* Header */}
          <div
            className={`${chatbotConfig.theme.primaryColor} flex items-center justify-between rounded-t-lg p-4 text-white`}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <h3 className="text-sm font-semibold">{chatbotConfig.title}</h3>
              {isGuest && <span className="rounded bg-white bg-opacity-20 px-2 py-1 text-xs text-black">Guest</span>}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white transition-colors hover:text-gray-200"
                aria-label="Đóng chatbot"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <>
            <div ref={messagesContainerRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
              {messages.length === 0 && (
                <div className="mt-8 text-center text-gray-500">
                  <MessageCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{chatbotConfig.welcomeMessage}</p>
                  {/* Debug info */}
                  <p className="mt-2 text-xs text-gray-400">User ID: {userId}</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${msg.user_id ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 min-w-8 items-center justify-center rounded-full text-xs text-white ${
                      msg.user_id ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    {msg.user_id ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`${
                      msg.user_id 
                        ? 'max-w-xs' 
                        : msg.message.includes('<') && msg.message.includes('>') 
                          ? 'max-w-full' 
                          : 'max-w-xs'
                    } rounded-lg p-3 ${
                      msg.user_id
                        ? 'rounded-tr-none bg-blue-600 text-white'
                        : 'rounded-tl-none border border-gray-200 bg-white text-gray-800'
                    }`}
                  >
                    {msg.user_id ? (
                      <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                    ) : (
                      // Check if message contains HTML tags, if so render as HTML
                      msg.message.includes('<') && msg.message.includes('>') ? (
                        <div 
                          className="text-sm"
                          dangerouslySetInnerHTML={{ __html: msg.message }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                      )
                    )}
                    <p className={`mt-1 text-xs ${msg.user_id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {showTypingIndicator && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="rounded-b-lg border-t border-gray-200 bg-white p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={chatbotConfig.placeholder}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isWaitingResponse}
                />
                <button
                  onClick={sendMessage}
                  disabled={isWaitingResponse || inputValue.trim() === ''}
                  className={`${chatbotConfig.theme.primaryColor} rounded-lg p-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400`}
                  aria-label="Gửi tin nhắn"
                >
                  {isWaitingResponse ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
