import React from 'react';

import Container from '@/components/ui/container';
import Footer from '@/components/layout/marketing/footer';
import Header from '@/components/layout/marketing/header';
import { ChatbotV2 } from '@/components/shared/chatbot_v2';

import '@/styles/chatbot.css';

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col gap-10">
      <Header navItemClassName="text-dark" />
      <Container>
        <main className="mt-[80px] flex-1">{children}</main>
      </Container>
      <Footer />
      <ChatbotV2 />
    </div>
  );
};

export default MarketingLayout;
