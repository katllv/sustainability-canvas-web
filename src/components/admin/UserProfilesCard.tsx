import { Users } from 'lucide-react';
import { AdminCard } from '@/components/ui/admin-card';
import { Spinner } from '../ui/spinner';

interface UserWithProfile {
  id: string;
  email: string;
  role: number;
  profile?: {
    name: string | null;
  };
}

interface UserProfilesCardProps {
  users?: UserWithProfile[];
  isLoading: boolean;
}

export function UserProfilesCard({ users, isLoading }: UserProfilesCardProps) {
  return (
    <AdminCard
      title='User Profiles Overview'
      icon={<Users className='w-5 h-5' />}
      headerColor='var(--admin-blue)'
      borderColor='var(--admin-blue)'
      className='mb-6'>
      <p className='mb-4 text-sm'>Total registered users: {users?.length || 0}</p>

      {isLoading ? (
        <div className='flex items-center gap-3 mb-6'>
          <Spinner size='md' />
          <p className='text-gray-500'>Loading users...</p>
        </div>
      ) : (
        <div className='rounded-lg overflow-hidden border'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Name</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Email</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Created</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className='divide-y bg-white'>
              {users?.map((user: UserWithProfile) => (
                <tr
                  key={user.id}
                  className='hover:bg-gray-50'>
                  <td className='px-4 py-3 text-sm'>{user.profile?.name || 'N/A'}</td>
                  <td className='px-4 py-3 text-sm'>{user.email}</td>
                  <td className='px-4 py-3 text-sm text-gray-600'>2024-11-10</td>
                  <td className='px-4 py-3 text-sm text-gray-600'>2024-11-17</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminCard>
  );
}
