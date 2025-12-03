import React from 'react';
import ReactDOM from 'react-dom/client';
import '../style.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { RouterProvider } from '@tanstack/react-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes (won't refetch on mount if fresh)
      gcTime: 10 * 60 * 1000, // Cache data for 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: true, // Allow refetch on mount, but staleTime prevents it if data is fresh
      refetchOnReconnect: false, // Don't refetch when network reconnects
    },
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
