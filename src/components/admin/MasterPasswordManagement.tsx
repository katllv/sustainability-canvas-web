import { Eye, EyeOff, RefreshCw, KeyRound } from 'lucide-react';
import { AdminCard } from '@/components/ui/admin-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useMasterPassword, useSetMasterPassword } from '@/api/users';
import { toast } from 'sonner';

export function MasterPasswordManagementCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: codeData, isLoading } = useMasterPassword();
  const setCodeMutation = useSetMasterPassword();

  const currentPassword = codeData?.password || '';

  const handleReset = async () => {
    if (!newPassword.trim()) {
      toast.error('Please enter a new password');
      return;
    }

    try {
      await setCodeMutation.mutateAsync(newPassword);
      toast.success('Master password updated successfully');
      setNewPassword('');
      setIsEditing(false);
    } catch (error) {
      toast.error(
        `Failed to update master password: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  return (
    <AdminCard
      title='Master Password Management'
      icon={<KeyRound className='w-5 h-5' />}
      headerColor='var(--the-orange)'
      borderColor='var(--the-orange)'
      className='mb-6'>
      <p className='text-sm mb-4'>
        Manage the master password required for new admin user registration
      </p>
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-2'>Current Master Password</label>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={isLoading ? 'Loading...' : currentPassword}
              readOnly
              className='pr-10'
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
              {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
          <Button
            variant='outline'
            className='flex items-center gap-2 w-35'
            onClick={() => setIsEditing(!isEditing)}>
            <RefreshCw className='w-4 h-4' />
            {isEditing ? 'Cancel' : 'Change Code'}
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className='mt-4'>
          <label className='block text-sm font-medium mb-2'>New Master Password</label>
          <div className='flex gap-2'>
            <Input
              type='text'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new master password'
              className='flex-1'
            />
            <Button
              onClick={handleReset}
              className='w-35'
              disabled={setCodeMutation.isPending || !newPassword.trim()}>
              {setCodeMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
