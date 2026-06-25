import { Metadata } from 'next';
import { Suspense } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import {
  APP_DESCRIPTION,
  APP_NAME,
  PAGE_CONTAINER_CLASS,
  SERVER_URL,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    template: `%s | Business In Touch`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={<div className="border-b border-black/10 bg-white py-3" aria-hidden />}>
        <SiteHeader />
      </Suspense>
      <main className={`${PAGE_CONTAINER_CLASS} flex-1 bg-white py-8`}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
