import { useAllUsers } from '@/api/users';
import {
  UserProfilesCard,
  RegistrationCodeManagementCard,
  DangerZoneCard,
  MasterPasswordManagementCard,
} from '@/components/admin';

export default function AdminDashboard() {
  const { data: users, isLoading } = useAllUsers();

  return (
    <div className='h-full'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
          <h1>Admin Dashboard</h1>
          <p className='text-gray-600 mt-1'>Digital Sustainability Canvas</p>
        </div>

        <UserProfilesCard
          users={users}
          isLoading={isLoading}
        />
        <RegistrationCodeManagementCard />
        <MasterPasswordManagementCard />
        <DangerZoneCard />
      </div>
    </div>
  );
}
