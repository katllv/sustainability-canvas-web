import { SustainabilityCanvas } from '@/components/canvas';
import { EditProjectTitleDialog } from '@/components/projects';
import { Download, Pencil, Printer } from 'lucide-react';
import { useProject } from '@/api/projects';
import { useProjectImpacts, type Impact } from '@/api/impacts';
import { useParams, Navigate } from '@tanstack/react-router';
import { useState } from 'react';
import ExcelJS from 'exceljs';
import { Spinner } from '@/components/ui/spinner';

export default function CanvasPage() {
  // route: /app-layout/projects/$projectId/canvas
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });
  const { data: project, isLoading: loading, isError: loadError } = useProject(projectId);
  const { data: impacts = [] } = useProjectImpacts(projectId);
  const [editTitleOpen, setEditTitleOpen] = useState(false);

  async function handleDownloadExcel() {
    if (!impacts || impacts.length === 0) {
      alert('No impacts to export');
      return;
    }

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Canvas Impacts');

    // Define columns
    worksheet.columns = [
      { header: 'Section', key: 'section', width: 12 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Relation', key: 'relation', width: 10 },
      { header: 'Dimension', key: 'dimension', width: 15 },
      { header: 'Score', key: 'score', width: 8 },
      { header: 'SDGs', key: 'sdgs', width: 20 },
      { header: 'Created', key: 'created', width: 12 },
    ];

    // Add rows
    impacts.forEach((impact: Impact) => {
      worksheet.addRow({
        section: impact.type,
        title: impact.title,
        description: impact.description || '',
        relation: impact.relation,
        dimension: impact.dimension,
        score: impact.score,
        sdgs: impact.impactSdgs?.map((sdg) => sdg.sdgId || sdg.id).join(', ') || '',
        created: impact.createdAt ? new Date(impact.createdAt).toLocaleDateString() : '',
      });
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.title || 'canvas'}_impacts.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
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
