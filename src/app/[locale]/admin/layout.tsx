import React from 'react';

import Footer from '@/components/common/footer';
import Header from '@/components/common/header';

import '@/styles/admin.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
