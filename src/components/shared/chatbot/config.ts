import type { ChatbotConfig } from './types';

// Default chatbot configuration
export const defaultChatbotConfig: ChatbotConfig = {
  apiUrl: process.env.NEXT_PUBLIC_CHATBOT_V2_API_URL || 'http://localhost:8000/api',
  title: 'Trợ lý Du lịch AI',
  placeholder: 'Hỏi về tour du lịch làng dân tộc...',
  welcomeMessage:
    'Xin chào! Tôi là trợ lý AI chuyên về du lịch dân tộc thiểu số Việt Nam. Tôi có thể giúp bạn:\n\n• Tìm kiếm tour du lịch\n• Tư vấn về văn hóa, phong tục dân tộc\n• Hỗ trợ đặt tour và thanh toán\n• Trả lời câu hỏi về địa điểm, giá cả\n\nBạn muốn biết điều gì?',
  errorMessage: '❌ Xin lỗi, có lỗi xảy ra khi kết nối với trợ lý AI. Vui lòng thử lại.',
  position: 'bottom-right',
  theme: {
    primaryColor: 'bg-emerald-600',
    textColor: 'text-gray-800',
    backgroundColor: 'bg-white',
    borderColor: 'border-gray-200',
  },
  sessionConfig: {
    maxMessages: 50,
    storageKey: 'chatbot_session', // Unified storage key
  },
  suggestions: ['Tìm tour miền núi', 'Văn hóa Tày', 'Đặt tour 4 người'],
};

// Helper function to get position classes
export const getChatbotPosition = (position: ChatbotConfig['position']): string => {
  const positions = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };
  return positions[position] || positions['bottom-right'];
};
