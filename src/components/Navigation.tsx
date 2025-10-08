import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export function Navigation() {
  return (
    <nav className='w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className=' flex h-14 items-center px-6'>
        <Link
          to='/'
          className='mr-8 flex items-center 
          space-x-2 text-xl font-bold hover:text-foreground/80 transition-colors'>
          Sustainability Canvas
        </Link>

        <div className='flex flex-1 items-center justify-between'>
          <nav className='flex items-center space-x-8 text-sm font-medium'>
            <Link
              to='/'
              className='transition-colors hover:text-foreground/80 text-foreground'>
              Home
            </Link>
            <Link
              to='/canvas'
              className='transition-colors hover:text-foreground/80 text-foreground/60'>
              Canvas
            </Link>
            <Link
              to='/projects'
              className='transition-colors hover:text-foreground/80 text-foreground/60'>
              Projects
            </Link>
          </nav>

          <div className='flex items-center space-x-3'>
            <Button
              variant='ghost'
              size='sm'>
              Sign In
            </Button>
            <Button size='sm'>Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
