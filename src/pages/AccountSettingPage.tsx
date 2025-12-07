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
  const { user, profile, signOut } = useAuth();
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-the-dark-blue mb-6">Account settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#1B4965]">Account settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Profile Information</h3>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.picture_url || undefined} />
                <AvatarFallback className="bg-the-dark-blue text-white text-lg">
                  {getInitials(profile?.name || user?.email || '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">{profile?.name || 'No name set'}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Email Address</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <span className="text-gray-700">{user?.email}</span>
              <Button
                variant="outline"
                onClick={() => setChangeEmailOpen(true)}
                className="border-the-dark-blue text-the-dark-blue hover:bg-the-dark-blue hover:text-white"
              >
                Change Email
              </Button>
            </div>
          </div>

          {/* Log Out */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Log Out</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <span className="text-gray-600 text-sm">Sign out of your account</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>

          {/* Delete Account */}
          <div>
            <h3 className="text-sm font-medium text-red-600 mb-2">Delete Account</h3>
            <div className="flex items-center justify-between bg-red-50 p-4 rounded-md border border-red-200">
              <span className="text-red-600 text-sm">
                Permanently delete your account and all data
              </span>
              <Button
                variant="outline"
                onClick={() => setDeleteAccountOpen(true)}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
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
