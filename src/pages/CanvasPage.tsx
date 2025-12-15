import { SustainabilityCanvas } from '@/components/canvas';
import { EditProjectTitleDialog } from '@/components/projects';
import { Download, Pencil, Printer } from 'lucide-react';
import { useProject } from '@/api/projects';
import { useProjectImpacts } from '@/api/impacts';
import { useParams, Navigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { exportCanvasToExcel } from '@/lib/export-canvas';

export default function CanvasPage() {
  // route: /app-layout/projects/$projectId/canvas
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });
  const { data: project, isLoading: loading, isError: loadError } = useProject(projectId);
  const { data: impacts = [] } = useProjectImpacts(projectId);
  const [editTitleOpen, setEditTitleOpen] = useState(false);

  async function handleDownloadExcel() {
    await exportCanvasToExcel(impacts, project?.title);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex items-center gap-3 mb-6'>
          <Spinner size='lg' />
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
    <div className='flex flex-col h-full print:block'>
      <div className='flex items-baseline justify-between gap-3 pb-6 flex-shrink-0 print:hidden'>
        <div className='flex items-baseline gap-3'>
          <h2>{project.title || 'Untitled Project'}</h2>
          <Pencil
            className='cursor-pointer'
            onClick={() => setEditTitleOpen(true)}
          />
        </div>
        <div className='flex gap-3'>
          <Printer
            className='cursor-pointer'
            onClick={handlePrint}
          />
          <Download
            className='cursor-pointer'
            onClick={handleDownloadExcel}
          />
        </div>
      </div>
      <div
        id='sustainability-canvas'
        className='flex-1 min-h-0 mb-6'>
        <SustainabilityCanvas projectId={projectId} />
      </div>

      <EditProjectTitleDialog
        open={editTitleOpen}
        onOpenChange={setEditTitleOpen}
        projectId={projectId}
        currentTitle={project.title || ''}
      />
    </div>
  );
}
