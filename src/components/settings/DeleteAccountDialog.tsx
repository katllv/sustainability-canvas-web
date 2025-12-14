import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/useAuth';
import { useDeleteUser } from '@/api/users';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await deleteUserMutation.mutateAsync(String(user.id));
      toast.success('Account deleted successfully');
      signOut();
      navigate({ to: '/login' });
    } catch (error) {
      toast.error(
        `Failed to delete account: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all
            your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600'>
            {loading ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
