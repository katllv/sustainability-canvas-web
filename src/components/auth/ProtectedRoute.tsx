import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
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

  return <>{children}</>;
}
