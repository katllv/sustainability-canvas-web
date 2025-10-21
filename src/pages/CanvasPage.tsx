import { SustainabilityCanvas } from '@/components/canvas';
import { Pencil } from 'lucide-react';
import { useParams, Navigate } from 'react-router';
import { useEffect, useState } from 'react';
import { getProject } from '@/api/projects';
import { useAuth } from '@/lib/auth';

interface Project {
  id: string;
  title: string;
  description: string | null;
  project_collaborators: Array<{
    user_id: string;
    role: string;
  }>;
}

export default function CanvasPage() {
  const { user } = useAuth();
  const { id: projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || !user) return;

      try {
        const { data, error } = await getProject(projectId);
        if (data && !error) {
          setProject(data);
          // Check if current user is a collaborator
          const userHasAccess = data.project_collaborators?.some(
            (collaborator: { user_id: string; role: string }) => collaborator.user_id === user.id,
          );
          setHasAccess(userHasAccess);
        }
      } catch (error) {
        console.error('Error loading project:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, user]);

  if (loading) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex items-baseline gap-3 mb-6'>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Redirect to projects if user doesn't have access
  if (!hasAccess) {
    return (
      <Navigate
        to='/projects'
        replace
      />
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-baseline gap-3 mb-6'>
        <h2>{project?.title || 'Untitled Project'}</h2>
        <Pencil className='text-the-dark-blue size-5' />
      </div>
      <SustainabilityCanvas />
    </div>
  );
}
