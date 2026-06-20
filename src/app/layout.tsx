import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/app/providers';

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
    <html lang="uk" className="h-full">
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
