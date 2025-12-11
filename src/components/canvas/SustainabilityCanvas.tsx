import { CanvasSection } from './CanvasSection';
import { useState } from 'react';
import { useProjectImpacts, type Impact, type SectionType } from '@/api/impacts';
import AddImpactDialog from './AddImpactDialog';

interface SustainabilityCanvasProps {
  projectId: string;
}

export function SustainabilityCanvas({ projectId }: SustainabilityCanvasProps) {
  const { data: impacts = [], isLoading: loading } = useProjectImpacts(projectId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('bg-white');

  const handleOpenDialog = (section: SectionType, color: string) => {
    setSelectedSection(section);
    setSelectedColor(color);
    setDialogOpen(true);
  };

  const handleImpactCreated = () => {
    // No need to manually update - TanStack Query will refetch automatically
  };

  const getImpactsForSection = (sectionType: string) => {
    return impacts.filter((impact: Impact) => impact.type === sectionType);
  };

  if (loading) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <div className='text-gray-600'>Loading canvas...</div>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col gap-3'>
      <div className='grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr] gap-3 flex-1 min-h-0 print:break-inside-avoid'>
        <CanvasSection
          title='Key Stakeholders (KS)'
          backgroundColor='bg-the-light-blue'
          impacts={getImpactsForSection('KS')}
          onClick={() => handleOpenDialog('KS', 'bg-the-light-blue')}
        />
        <CanvasSection
          title='Key Activities (KA)'
          backgroundColor='bg-the-light-blue'
          impacts={getImpactsForSection('KA')}
          onClick={() => handleOpenDialog('KA', 'bg-the-light-blue')}
        />
        <CanvasSection
          title='Unique Value Proposition (UVP)'
          backgroundColor='bg-the-lavender'
          impacts={getImpactsForSection('UVP')}
          onClick={() => handleOpenDialog('UVP', 'bg-the-lavender')}
        />
        <CanvasSection
          title='Customer Relationship (CR)'
          backgroundColor='bg-the-yellow'
          impacts={getImpactsForSection('CR')}
          onClick={() => handleOpenDialog('CR', 'bg-the-yellow')}
        />
        <CanvasSection
          title='Customer Segment (CS)'
          backgroundColor='bg-the-yellow'
          impacts={getImpactsForSection('CS')}
          onClick={() => handleOpenDialog('CS', 'bg-the-yellow')}
        />
      </div>

      <div className='grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr] gap-3 flex-1 min-h-0 print:break-inside-avoid'>
        <CanvasSection
          title='Waste Management (WM)'
          backgroundColor='bg-the-light-blue'
          impacts={getImpactsForSection('WM')}
          onClick={() => handleOpenDialog('WM', 'bg-the-light-blue')}
        />
        <CanvasSection
          title='Key Technology & Resources (KTR)'
          backgroundColor='bg-the-light-blue'
          impacts={getImpactsForSection('KTR')}
          onClick={() => handleOpenDialog('KTR', 'bg-the-light-blue')}
        />
        <div className='flex flex-col gap-3 min-h-0'>
          <CanvasSection
            title='Cost (CO)'
            backgroundColor='bg-the-orange'
            className='flex-1 min-h-0'
            impacts={getImpactsForSection('CO')}
            onClick={() => handleOpenDialog('CO', 'bg-the-orange')}
          />
          <CanvasSection
            title='Revenue (RE)'
            backgroundColor='bg-the-green'
            className='flex-1 min-h-0'
            impacts={getImpactsForSection('RE')}
            onClick={() => handleOpenDialog('RE', 'bg-the-green')}
          />
        </div>
        <CanvasSection
          title='Channels (CH)'
          backgroundColor='bg-the-yellow'
          impacts={getImpactsForSection('CH')}
          onClick={() => handleOpenDialog('CH', 'bg-the-yellow')}
        />
        <CanvasSection
          title='Governance (GO)'
          backgroundColor='bg-the-yellow'
          impacts={getImpactsForSection('GO')}
          onClick={() => handleOpenDialog('GO', 'bg-the-yellow')}
        />
      </div>
      <AddImpactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={projectId}
        sectionKey={selectedSection || 'UVP'}
        existingImpacts={selectedSection ? getImpactsForSection(selectedSection) : []}
        onCreated={handleImpactCreated}
        backgroundColor={selectedColor}
      />
    </div>
  );
}
