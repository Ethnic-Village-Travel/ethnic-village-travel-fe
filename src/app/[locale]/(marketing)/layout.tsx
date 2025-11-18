import React from 'react';

import { MarketingChatbot } from '@/components/chatbot';
import Footer from '@/components/layout/marketing/footer';
import Header from '@/components/layout/marketing/header';

import '@/styles/chatbot.css';

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col gap-10">
      <Header navItemClassName="text-dark" />
      <main className="mx-auto mt-[80px] w-full max-w-screen-2xl flex-1 px-4 md:px-8 lg:px-16 xl:px-28">
        {children}
      </main>
      <Footer />
      <MarketingChatbot />
    </div>
  );
};

export default MarketingLayout;
