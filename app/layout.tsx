import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import '../styles/globals.css';

import Providers from './[locale]/providers';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Ethnic Village Travel',
    default: 'Ethnic Village Travel',
  },
  description: 'Khám phá vẻ đẹp của các làng dân tộc Việt Nam',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
