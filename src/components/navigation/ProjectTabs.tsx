import { Link, useLocation } from 'react-router';

interface ProjectTabsProps {
  projectId: string;
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const location = useLocation();

  const isActiveTab = (tabPath: string) => {
    return location.pathname.includes(tabPath);
  };

  return (
    <div className='flex items-end h-full space-x-8 lg:pl-14'>
      <Link
        to={`/project/${projectId}/canvas`}
        className={`h-full flex items-end pb-3 px-2 text-base font-bold relative text-the-dark-blue`}>
        Canvas
        {isActiveTab('canvas') && (
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-the-dark-blue'></div>
        )}
      </Link>
      <Link
        to={`/project/${projectId}/analysis`}
        className={`h-full flex items-end pb-3 px-2 text-base font-bold relative text-the-dark-blue`}>
        Analysis
        {isActiveTab('analysis') && (
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-the-dark-blue'></div>
        )}
      </Link>
      <Link
        to={`/project/${projectId}/team`}
        className={`h-full flex items-end pb-3 px-2 text-base font-bold relative text-the-dark-blue`}>
        Team
        {isActiveTab('team') && (
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-the-dark-blue'></div>
        )}
      </Link>
    </div>
  );
}
