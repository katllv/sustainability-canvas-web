import { useAllUsers } from '@/api/users';
import { Users, Eye, EyeOff, RefreshCw, XCircle, Database } from 'lucide-react';
import { AdminCard } from '@/components/ui/admin-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AdminDashboard() {
  const { data: users, isLoading } = useAllUsers();
  const [showPassword, setShowPassword] = useState(false);

  // Mock data for password
  const currentPassword = 'canvas2024';

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-the-dark-blue">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Sustainable Digital Canvas</p>
      </div>

      {/* User Profiles Overview */}
      <AdminCard
        title="User Profiles Overview"
        icon={<Users className="w-5 h-5" />}
        headerColor="var(--admin-blue)"
        borderColor="var(--admin-blue)"
        className="mb-6"
      >
        <p className="mb-4 text-sm">Total registered users: {users?.length || 0}</p>
        
        {isLoading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="rounded-lg overflow-hidden border">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white">
                {users?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{user.profile?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">2024-11-10</td>
                    <td className="px-4 py-3 text-sm text-gray-600">2024-11-17</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Sign-up Password Management */}
      <AdminCard
        title="Sign-up Password Management"
        headerColor="var(--admin-purple)"
        borderColor="var(--admin-purple)"
        className="mb-6"
      >
        <p className="text-sm mb-4">Manage the password required for new user registration</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Current Sign-up Password</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                readOnly
                className="pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset Password
            </Button>
          </div>
        </div>
      </AdminCard>

      {/* Danger Zone */}
      <AdminCard
        title="Danger Zone"
        icon={<XCircle className="w-5 h-5" />}
        headerColor="var(--admin-red-bg)"
        borderColor="var(--admin-red-stroke)"
        titleColor="var(--admin-red-button)"
      >
        <p className="text-sm mb-4 text-gray-700">Irreversible actions - use with extreme caution</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border" style={{ borderColor: 'var(--admin-red-stroke)' }}>
            <div>
              <h3 className="font-semibold text-sm mb-1">Close project</h3>
              <p className="text-sm text-gray-600">This opens a guide to how to shut down the project through Azure</p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-2"
              style={{ 
                color: 'var(--admin-red-button)',
                borderColor: 'var(--admin-red-button)'
              }}
            >
              <XCircle className="w-4 h-4" />
              Close Project
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border" style={{ borderColor: 'var(--admin-red-stroke)' }}>
            <div>
              <h3 className="font-semibold text-sm mb-1">Delete All Data</h3>
              <p className="text-sm text-gray-600">Remove all data including users and project information</p>
            </div>
            <Button 
              className="flex items-center gap-2"
              style={{ backgroundColor: 'var(--admin-red-button)' }}
            >
              <Database className="w-4 h-4" />
              Delete All Data
            </Button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
