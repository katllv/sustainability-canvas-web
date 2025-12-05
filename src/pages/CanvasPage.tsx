import { SustainabilityCanvas } from '@/components/canvas';
import { Download, Pencil, Printer } from 'lucide-react';
import { useProject } from '@/api/projects';
import { useParams, Navigate } from '@tanstack/react-router';

export default function CanvasPage() {
  // route: /app-layout/projects/$projectId/canvas
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });
  const { data: project, isLoading: loading, isError: loadError } = useProject(projectId);

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
    <div className='flex flex-1 flex-col h-full'>
      <div className='flex flex-1 items-baseline justify-between gap-3 mb-6'>
        <div className='flex items-baseline gap-3'>
          <h2>{project.title || 'Untitled Project'}</h2>
          <Pencil />
        </div>
        <div className='flex gap-3'>
          <Printer />
          <Download />
        </div>
      </div>
      <div className='h-150'>
        <SustainabilityCanvas projectId={projectId} />
      </div>
    </div>
  );
}
