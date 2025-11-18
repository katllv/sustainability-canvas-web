import { Link, useLocation } from 'react-router';
import { AvatarDropdown } from '../navigation/AvatarDropdown';
import { AddProjectDialog } from '../projects/AddProjectDialog';
import { ProjectTabs } from '../navigation/ProjectTabs';
import { useAuth } from '@/lib/auth';

export function Header() {
  const location = useLocation();
  const { profile } = useAuth();

  //get project id from pathname
  const pathSegments = location.pathname.split('/');
  const projectId = pathSegments[2]; //get id from /project/{id}/...

  const userData = {
    name: profile?.name || profile?.email?.split('@')[0] || 'User',
    email: profile?.email || '',
    avatarUrl: profile?.picture_url || '',
  };

  //check if we're inside a specific project (not on projects overview)
  const isInsideProject = location.pathname.startsWith('/project/') && pathSegments[2];

  return (
    <nav className='w-full bg-white'>
      <div className=' flex h-24 px-6'>
        <div className='flex flex-1 justify-between'>
          {isInsideProject ? <ProjectTabs projectId={projectId} /> : <div></div>}
          <div className='flex items-center space-x-10'>
            <nav className='flex items-center space-x-8 font-bold'>
              <Link to='/projects'>Projects</Link>
              <Link to='/collaborators'>Collaborators</Link>
            </nav>
            <AddProjectDialog />
            <AvatarDropdown
              name={userData.name}
              email={userData.email}
              avatarUrl={userData.avatarUrl}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
