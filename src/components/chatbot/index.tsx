import React from 'react';

import Chatbot from './chatbot';
import { type ChatbotConfig } from './chatbot-config';

// Marketing chatbot với cấu hình đặc biệt cho trang marketing
export const MarketingChatbot: React.FC = () => {
  const marketingConfig: Partial<ChatbotConfig> = {
    title: 'Du lịch Làng Dân tộc',
    welcomeMessage:
      'Xin chào! Tôi là trợ lý ảo du lịch. Tôi có thể giúp bạn tìm hiểu về các tour du lịch làng dân tộc, địa điểm thú vị, và trải nghiệm văn hóa độc đáo. Bạn muốn biết gì?',
    placeholder: 'Hỏi về tour, địa điểm, văn hóa...',
    errorMessage: '❌ Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.',
    theme: {
      primaryColor: 'bg-emerald-600',
      textColor: 'text-gray-800',
      backgroundColor: 'bg-white',
      borderColor: 'border-emerald-200',
    },
  };

  return <Chatbot config={marketingConfig} />;
};

// Admin chatbot với cấu hình khác
export const AdminChatbot: React.FC = () => {
  const adminConfig: Partial<ChatbotConfig> = {
    title: 'Trợ lý Admin',
    welcomeMessage:
      'Xin chào Admin! Tôi có thể giúp bạn quản lý hệ thống, kiểm tra dữ liệu, và hỗ trợ các tác vụ quản trị.',
    placeholder: 'Hỏi về quản lý, thống kê...',
    theme: {
      primaryColor: 'bg-purple-600',
      textColor: 'text-gray-800',
      backgroundColor: 'bg-white',
      borderColor: 'border-purple-200',
    },
  };

  return <Chatbot config={adminConfig} />;
};

// Customer support chatbot
export const SupportChatbot: React.FC = () => {
  const supportConfig: Partial<ChatbotConfig> = {
    title: 'Hỗ trợ khách hàng',
    welcomeMessage:
      'Xin chào! Tôi là trợ lý hỗ trợ khách hàng. Tôi có thể giúp bạn với các vấn đề về đặt tour, thanh toán, hoặc thay đổi lịch trình.',
    placeholder: 'Cần hỗ trợ gì...',
    position: 'bottom-left',
    theme: {
      primaryColor: 'bg-orange-600',
      textColor: 'text-gray-800',
      backgroundColor: 'bg-white',
      borderColor: 'border-orange-200',
    },
  };

  return <Chatbot config={supportConfig} />;
};

export default Chatbot;
