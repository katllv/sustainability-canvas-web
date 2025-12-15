import { Navigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/useAuth';
import { Spinner } from '@/components/ui/spinner';
import Root from '@/pages/RootLayout';

export default function AppLayout() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen bg-the-light-grey flex items-center justify-center gap-2'>
        <Spinner size='lg' />
        <h2>Loading...</h2>
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
