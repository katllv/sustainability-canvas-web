import { Link, useLocation } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface ProjectTabsProps {
  projectId: string;
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActiveTab = (tabPath: string) => {
    return location.pathname.includes(tabPath);
  };

  const tabs = [
    { path: '/projects/$projectId/canvas', label: 'Canvas', key: 'canvas' },
    { path: '/projects/$projectId/analysis', label: 'Analysis', key: 'analysis' },
    { path: '/projects/$projectId/team', label: 'Team', key: 'team' },
  ];

  const activeTab = tabs.find((tab) => isActiveTab(tab.key));

  return (
    <>
      {/* Desktop tabs */}
      <div className='hidden sm:flex items-end h-full space-x-8 lg:pl-14'>
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            to={tab.path}
            params={{ projectId }}
            className='h-full flex items-end pb-3 px-2 text-base font-bold relative text-the-dark-blue'>
            {tab.label}
            {isActiveTab(tab.key) && (
              <div className='absolute bottom-0 left-0 right-0 h-1 bg-the-dark-blue' />
            )}
          </Link>
        ))}
      </div>

      {/* Mobile burger menu */}
      <div className='sm:hidden relative'>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className='flex items-center gap-1 p-2 font-bold text-the-dark-blue'>
          <Menu className='w-5 h-5' />
          <span className='text-sm'>{activeTab?.label}</span>
        </button>
        {mobileMenuOpen && (
          <>
            <div
              className='fixed inset-0 z-10'
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className='absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-20 min-w-[120px]'>
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  to={tab.path}
                  params={{ projectId }}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-bold hover:bg-gray-100 ${
                    isActiveTab(tab.key) ? 'text-the-dark-blue bg-gray-50' : 'text-gray-700'
                  }`}>
                  {tab.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
