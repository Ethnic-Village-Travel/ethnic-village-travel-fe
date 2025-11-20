import { envConfig } from '@/core/configs/env.config';

export interface ChatbotConfig {
  apiUrl: string | undefined;
  title: string;
  placeholder: string;
  welcomeMessage: string;
  errorMessage: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: {
    primaryColor: string;
    textColor: string;
    backgroundColor: string;
    borderColor: string;
  };
}

export const defaultChatbotConfig: ChatbotConfig = {
  apiUrl: envConfig.CHATBOT_API_URL,
  title: 'Trợ lý ảo Du lịch',
  placeholder: 'Nhập câu hỏi về du lịch...',
  welcomeMessage: 'Xin chào! Tôi có thể giúp bạn tìm hiểu về các tour du lịch làng dân tộc. Bạn muốn biết gì?',
  errorMessage: '❌ Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
  position: 'bottom-right',
  theme: {
    primaryColor: 'bg-blue-600',
    textColor: 'text-gray-800',
    backgroundColor: 'bg-white',
    borderColor: 'border-gray-200',
  },
};

export const getChatbotPosition = (position: ChatbotConfig['position']) => {
  switch (position) {
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'top-right':
      return 'top-4 right-4';
    case 'top-left':
      return 'top-4 left-4';
    default:
      return 'bottom-4 right-4';
  }
};
