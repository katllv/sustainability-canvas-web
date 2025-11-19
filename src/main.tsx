import React from 'react';
import ReactDOM from 'react-dom/client';
import '../style.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { RouterProvider } from '@tanstack/react-router';

const queryClient = new QueryClient();

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
