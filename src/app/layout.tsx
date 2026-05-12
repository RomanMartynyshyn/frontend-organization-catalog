import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic-ext'],
});

export const metadata: Metadata = {
  title: 'Каталог організацій',
  description: 'Головна та профіль компанії (каркас до підключення API).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
