import { XCircle, Database } from 'lucide-react';
import { AdminCard } from '@/components/ui/admin-card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DeleteAllDataDialog } from './DeleteAllDataDialog';
import { CloseProjectDialog } from './CloseProjectDialog';
import { useDeleteAllNonAdmin } from '@/api/users';
import { toast } from 'sonner';

export function DangerZoneCard() {
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [closeProjectDialogOpen, setCloseProjectDialogOpen] = useState(false);
  const deleteAllMutation = useDeleteAllNonAdmin();

  const handleDeleteAllClick = () => {
    setDeleteAllDialogOpen(true);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      await deleteAllMutation.mutateAsync();
      toast.success('All non-admin users and data deleted successfully');
      setDeleteAllDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete data');
      console.error('Delete all data error:', error);
    }
  };

  return (
    <AdminCard
      title='Danger Zone'
      icon={<XCircle className='w-5 h-5' />}
      headerColor='var(--admin-red-bg)'
      borderColor='var(--admin-red-stroke)'
      titleColor='var(--admin-red-button)'>
      <p className='text-sm mb-4 text-gray-700'>Irreversible actions - use with extreme caution</p>

      <div className='space-y-4'>
        <div
          className='flex items-center justify-between p-4 bg-white rounded-lg border'
          style={{ borderColor: 'var(--admin-red-stroke)' }}>
          <div>
            <h3 className='font-semibold text-sm mb-1'>Close project</h3>
            <p className='text-sm text-gray-600'>
              This opens a guide to how to shut down the project through Azure
            </p>
          </div>
          <Button
            variant='outline'
            className='flex items-center gap-2 border-2 w-40'
            style={{
              color: 'var(--admin-red-button)',
              borderColor: 'var(--admin-red-button)',
            }}
            onClick={() => setCloseProjectDialogOpen(true)}>
            <XCircle className='w-4 h-4' />
            Close Project
          </Button>
        </div>

        <div
          className='flex items-center justify-between p-4 bg-white rounded-lg border'
          style={{ borderColor: 'var(--admin-red-stroke)' }}>
          <div>
            <h3 className='font-semibold text-sm mb-1'>Delete All Data</h3>
            <p className='text-sm text-gray-600'>
              Remove all data including users and project information
            </p>
          </div>
          <Button
            className='flex items-center gap-2 w-40'
            style={{ backgroundColor: 'var(--admin-red-button)' }}
            onClick={handleDeleteAllClick}
            disabled={deleteAllMutation.isPending}>
            <Database className='w-4 h-4' />
            {deleteAllMutation.isPending ? 'Deleting...' : 'Delete All Data'}
          </Button>
        </div>
      </div>

      <DeleteAllDataDialog
        open={deleteAllDialogOpen}
        onOpenChange={setDeleteAllDialogOpen}
        onConfirm={handleConfirmDeleteAll}
      />
      <CloseProjectDialog
        open={closeProjectDialogOpen}
        onOpenChange={setCloseProjectDialogOpen}
      />
    </AdminCard>
  );
}
