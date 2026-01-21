import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useChangePassword } from '@/api/users';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordFormData } from '@/schemas';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
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
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4 mt-4'>
          <Field>
            <Label htmlFor='current-password'>Current Password</Label>
            <Input
              id='current-password'
              type='password'
              placeholder='Enter current password'
              {...register('currentPassword')}
            />
            {errors.currentPassword && <FieldError>{errors.currentPassword.message}</FieldError>}
          </Field>

          <Field>
            <Label htmlFor='new-password'>New Password</Label>
            <Input
              id='new-password'
              type='password'
              placeholder='Enter new password'
              {...register('newPassword')}
            />
            {errors.newPassword && <FieldError>{errors.newPassword.message}</FieldError>}
          </Field>

          <Field>
            <Label htmlFor='confirm-password'>Confirm New Password</Label>
            <Input
              id='confirm-password'
              type='password'
              placeholder='Confirm new password'
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
          </Field>

          <Button
            type='submit'
            className='w-full'
            disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
