import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { AdminCard } from '@/components/ui/admin-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRegistrationCode, useSetRegistrationCode } from '@/api/users';
import { toast } from 'sonner';

export function RegistrationCodeManagementCard() {
  const [showCode, setShowCode] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: codeData, isLoading } = useRegistrationCode();
  const setCodeMutation = useSetRegistrationCode();

  const currentPassword = codeData?.code || '';

  const handleReset = async () => {
    if (!newCode.trim()) {
      toast.error('Please enter a new password');
      return;
    }

    try {
      await setCodeMutation.mutateAsync(newCode);
      toast.success('Registration code updated successfully');
      setNewCode('');
      setIsEditing(false);
    } catch (error) {
      toast.error(
        `Failed to update registration code: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  return (
    <AdminCard
      title='Registration Code Management'
      headerColor='var(--admin-purple)'
      borderColor='var(--admin-purple)'
      className='mb-6'>
      <p className='text-sm mb-4'>Manage the code required for new user registration</p>
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-2'>Current Registration Code</label>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Input
              type={showCode ? 'text' : 'password'}
              value={isLoading ? 'Loading...' : currentPassword}
              readOnly
              className='pr-10'
            />
            <button
              onClick={() => setShowCode(!showCode)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
              {showCode ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
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
          <label className='block text-sm font-medium mb-2'>New Registration Code</label>
          <div className='flex gap-2'>
            <Input
              type='text'
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder='Enter new code'
              className='flex-1'
            />
            <Button
              onClick={handleReset}
              className='w-35'
              disabled={setCodeMutation.isPending || !newCode.trim()}>
              {setCodeMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
