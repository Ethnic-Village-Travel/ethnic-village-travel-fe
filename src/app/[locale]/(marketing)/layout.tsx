import React from 'react';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

import '@/styles/globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col gap-10">
      <Header navItemClassName="text-dark" />
      <main className="mx-auto mt-[80px] max-w-screen-2xl flex-1">{children}</main>
      <Footer />
    </div>
  );
}
