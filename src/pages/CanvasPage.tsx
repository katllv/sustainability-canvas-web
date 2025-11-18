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
    profile_id: string;
    role: string;
  }>;
}

export default function CanvasPage() {
  const { profile } = useAuth();
  const { id: projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || !profile) return;

      try {
        const { data, error } = await getProject(projectId);
        if (data && !error) {
          setProject(data);
          // Check if current profile is a collaborator
          const profileHasAccess = data.project_collaborators?.some(
            (collaborator: { profile_id: string; role: string }) =>
              collaborator.profile_id === profile.id,
          );
          setHasAccess(profileHasAccess);
        }
      } catch (error) {
        console.error('Error loading project:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, profile]);

  if (loading) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex items-baseline gap-3 mb-6'>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Redirect to projects if profile doesn't have access
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
