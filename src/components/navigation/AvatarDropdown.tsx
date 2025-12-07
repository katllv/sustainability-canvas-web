import { User, Settings, LogOut, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';
import { useRouter } from '@tanstack/react-router';

interface AvatarDropdownProps {
  name: string;
  email: string;
  avatarUrl: string;
}

export function AvatarDropdown({ name, email, avatarUrl }: AvatarDropdownProps) {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 1;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.navigate({ to: '/login', replace: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none'>
        <Avatar className='w-14 h-14'>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='p-2 min-w-sm'
        sideOffset={20}>
        <DropdownMenuLabel className='flex flex-row items-center gap-4 p-4'>
          <Avatar className='w-14 h-14'>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='text-the-dark-blue font-bold text-xl'>{name}</p>
            <p>{email}</p>
          </div>
        </DropdownMenuLabel>
        {/* missing dropdown items */}
        <DropdownMenuItem onClick={() => router.navigate({ to: '/profile' })}>
          <User className='mr-2 inline-block size-4 text-the-dark-blue' />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.navigate({ to: '/account-settings' })}>
          <Settings className='mr-2 inline-block size-4 text-the-dark-blue' />
          Account settings
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => router.navigate({ to: '/admin' })}>
              <Shield className='mr-2 inline-block size-4 text-the-dark-blue' />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 size-4 text-the-dark-blue' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
