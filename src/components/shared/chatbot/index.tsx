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

/**
 * Main chatbot component - consolidated V2 + V3
 * Combines V2 auth logic with V3 UI features
 */
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
