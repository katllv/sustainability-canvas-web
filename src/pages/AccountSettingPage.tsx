import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Trash2 } from 'lucide-react';
import ChangeEmailDialog from '@/components/settings/ChangeEmailDialog';
import DeleteAccountDialog from '@/components/settings/DeleteAccountDialog';
import { useNavigate } from '@tanstack/react-router';

export default function AccountSettingPage() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate({ to: '/login' });
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className='container mx-auto py-8 px-6 max-w-5xl'>
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500'>Loading...</p>
        </div>
      </div>
    );
  }

  // Debug: log user data
  console.log('User data:', user);
  console.log('Profile data:', profile);

  return (
    <div className='container mx-auto py-8 px-6 max-w-5xl'>
      <Card className='bg-white shadow-sm'>
        <CardHeader className='border-b bg-white px-20 py-6'>
          <CardTitle className='text-2xl font-semibold text-the-dark-blue'>
            Account settings
          </CardTitle>
        </CardHeader>
        <CardContent className='px-20 py-8 space-y-8'>
          {/* Profile Information */}
          <div>
            <h3 className='mb-4'>Profile Information</h3>
            <div className='flex items-center gap-4 pl-6 bg-gray-50 px-4 py-3 rounded-md border border-gray-200'>
              <Avatar className='h-16 w-16'>
                <AvatarImage
                  className='object-cover mx-auto'
                  src={profile?.profileUrl || undefined}
                />
                <AvatarFallback className='bg-the-dark-blue text-white text-lg'>
                  {getInitials(profile?.name || user?.email || 'Test')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium text-gray-900 text-base'>{profile?.name || 'Admin'}</p>
                <p className='text-sm text-gray-500'>{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <h3 className='mb-4'>Email Address</h3>
            <div className='flex items-center gap-3'>
              <div className='flex-1 bg-gray-50 px-4 py-2 rounded-md border border-gray-200'>
                <div className='text-sm text-gray-700'>{user?.email}</div>
              </div>
              <Button
                variant='outline'
                onClick={() => setChangeEmailOpen(true)}
                className='border-the-dark-blue text-the-dark-blue hover:bg-the-dark-blue hover:text-white'>
                Change Email
              </Button>
            </div>
          </div>

          <div className='h-px w-full bg-gray-300' />

          {/* Log Out */}
          <div>
            <h3 className='mb-2'>Log out</h3>
            <div className=''>
              <div className='flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md border border-gray-200'>
                <div className='text-gray-600 text-sm'>Sign out of your account</div>
                <Button
                  variant='outline'
                  onClick={handleLogout}
                  className='border-gray-300 text-gray-700 hover:bg-gray-100'>
                  <LogOut className='h-4 w-4 mr-2' />
                  Log Out
                </Button>
              </div>
            </div>
          </div>

          {/* Delete Account */}
          <div>
            <h3 className='mb-2'>Delete Account</h3>
            <div className=''>
              <div className='flex items-center justify-between bg-red-50 px-4 py-3 rounded-md border border-red-200'>
                <div className='text-red-600 text-sm'>
                  Permanently delete your account and all data
                </div>
                <Button
                  variant='outline'
                  onClick={() => setDeleteAccountOpen(true)}
                  className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white'>
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ChangeEmailDialog
        open={changeEmailOpen}
        onOpenChange={setChangeEmailOpen}
        currentEmail={user?.email || ''}
      />
      <DeleteAccountDialog
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
      />
    </div>
  );
}
