import React from 'react';

import Footer from '@/components/common/footer';
import Header from '@/components/common/header';

import '@/styles/globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col">
      <Header navItemClassName="text-dark" />
      <main className="mt-[80px] flex-1">{children}</main>
      <Footer />
    </div>
  );
}
