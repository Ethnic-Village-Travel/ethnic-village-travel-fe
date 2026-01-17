import React from 'react';
import dynamic from 'next/dynamic';

import Container from '@/components/ui/container';
import Footer from '@/components/layout/marketing/footer';
import Header from '@/components/layout/marketing/header';

import '@/styles/chatbot.css';

const Chatbot = dynamic(() => import('@/components/shared/chatbot'));

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col gap-10">
      <Header navItemClassName="text-dark" />
      <Container>
        <main className="mt-[80px] flex-1">{children}</main>
      </Container>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default MarketingLayout;
