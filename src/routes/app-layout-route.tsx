import { Route, Navigate } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import Root from '../pages/RootLayout';
import { useAuth } from '@/lib/auth';

function AppLayout() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen bg-the-light-grey flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-the-dark-blue mx-auto mb-4'></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return <Root />;
}

export const appLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: AppLayout,
});
