import { SustainabilityCanvas } from '@/components/canvas';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProject } from '@/api/projects';
import { useParams, Navigate } from '@tanstack/react-router';

interface Project {
  id: string;
  title: string;
  description: string | null;
  project_collaborators?: Array<{
    profile_id: string;
    role: string;
  }>;
}

export default function CanvasPage() {
  // route: /app-layout/projects/$projectId/canvas
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false);
        setLoadError(true);
        return;
      }

      try {
        const data = await getProject(projectId);
        setProject(data);
      } catch (error) {
        console.error('Error loading project:', error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex items-baseline gap-3 mb-6'>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // redirect if error or project not found
  if (loadError || !project) {
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
        <h2>{project.title || 'Untitled Project'}</h2>
        <Pencil className='text-the-dark-blue size-5' />
      </div>
      <SustainabilityCanvas projectId={projectId} />
    </div>
  );
}
