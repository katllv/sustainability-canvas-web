import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@/lib/auth';
import { getProjects } from '@/api/projects';
import { useState } from 'react';

export function ProjectRedirect() {
  const { user } = useAuth();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findOldestProject = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: projects, error } = await getProjects(user.id);

        if (projects && projects.length > 0 && !error) {
          // Sort by created_at to get the oldest project
          const sortedProjects = projects.sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
          );
          const oldestProject = sortedProjects[0];
          setRedirectPath(`/project/${oldestProject.id}/canvas`);
        } else {
          // No projects found, redirect to projects page
          setRedirectPath('/projects');
        }
      } catch (error) {
        console.error('Error loading projects for redirect:', error);
        setRedirectPath('/projects');
      } finally {
        setLoading(false);
      }
    };

    findOldestProject();
  }, [user]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-gray-600'>Loading...</div>
      </div>
    );
  }

  if (redirectPath) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  // Fallback
  return (
    <Navigate
      to='/projects'
      replace
    />
  );
}
