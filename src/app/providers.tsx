'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import '@/i18n/i18n';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  );
}
