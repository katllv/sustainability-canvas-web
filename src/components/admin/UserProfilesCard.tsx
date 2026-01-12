import { Users, Trash2 } from 'lucide-react';
import { AdminCard } from '@/components/ui/admin-card';
import { Spinner } from '../ui/spinner';
import { useState } from 'react';
import { useDeleteUser } from '@/api/users';
import { toast } from 'sonner';
import { DeleteUserDialog } from './DeleteUserDialog';

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
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithProfile | null>(null);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteClick = (user: UserWithProfile) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

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
        <div className='rounded-lg overflow-hidden border max-h-[500px] overflow-y-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b sticky top-0'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Name</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Email</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-700'>Role</th>
                <th className='px-4  w-16'></th>
              </tr>
            </thead>
            <tbody className='divide-y bg-white'>
              {users?.map((user: UserWithProfile) => (
                <tr
                  key={user.id}
                  className='hover:bg-gray-50'
                  onMouseEnter={() => setHoveredUserId(user.id)}
                  onMouseLeave={() => setHoveredUserId(null)}>
                  <td className='px-4 py-3 text-sm'>{user.profile?.name || 'N/A'}</td>
                  <td className='px-4 py-3 text-sm'>{user.email}</td>
                  <td className='px-4 py-3 text-sm'>{user.role}</td>
                  <td className='px-4 text-sm'>
                    {hoveredUserId === user.id && (
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className='p-1 hover:bg-red-100 rounded text-red-600 transition-colors'
                        title='Delete user'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
      />
    </AdminCard>
  );
}
