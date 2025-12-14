import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateEmail } from '@/api/users';

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
}

export default function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
}: ChangeEmailDialogProps) {
  const [newEmail, setNewEmail] = useState('');
  const updateEmailMutation = useUpdateEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail) {
      toast.error('Please enter a new email address');
      return;
    }

    try {
      await updateEmailMutation.mutateAsync(newEmail);
      toast.success('Email updated successfully');
      onOpenChange(false);
      setNewEmail('');

      // Reload the page to refresh user data
      window.location.reload();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update email';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <button
          onClick={() => onOpenChange(false)}
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </button>

        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>Enter your new email address.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='new-email'>New Email Address</Label>
            <Input
              id='new-email'
              type='email'
              placeholder={currentEmail}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={updateEmailMutation.isPending}>
            {updateEmailMutation.isPending ? 'Updating...' : 'Update Email'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
