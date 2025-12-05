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
import { useAuth } from '@/lib/auth';
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
  
  console.log('AvatarDropdown - user:', user);
  console.log('AvatarDropdown - user.role:', user?.role);
  console.log('AvatarDropdown - isAdmin:', user?.role === 1);
  
  const isAdmin = user?.role === 1;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.navigate({ to: '/login', replace: true });
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
        <DropdownMenuItem>
          <Settings className='mr-2 inline-block size-4 text-the-dark-blue' />
          Account settings
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
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
