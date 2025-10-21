import { CanvasSection } from './CanvasSection';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getProjectImpacts, type Impact } from '@/api/impacts';

export function SustainabilityCanvas() {
  const { id: projectId } = useParams();
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImpacts = async () => {
      if (!projectId) return;

      try {
        const { data, error } = await getProjectImpacts(projectId);
        if (data && !error) {
          setImpacts(data);
        }
      } catch (error) {
        console.error('Error loading impacts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImpacts();
  }, [projectId]);

  // Helper function to get impacts for a specific section
  const getImpactsForSection = (sectionType: string) => {
    return impacts.filter((impact) => impact.section_type === sectionType);
  };

  if (loading) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <div className='text-gray-600'>Loading canvas...</div>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col gap-3 min-h-0'>
      <div className='grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr] gap-3 flex-1 min-h-0'>
        {/* First Row */}
        <CanvasSection
          title='Key Stakeholders (KS)'
          backgroundColor='bg-the-light-blue border-the-light-blue'
          impacts={getImpactsForSection('KS')}
        />
        <CanvasSection
          title='Key Activities (KA)'
          backgroundColor='bg-the-light-blue border-the-light-blue'
          impacts={getImpactsForSection('KA')}
        />
        <CanvasSection
          title='Unique Value Proposition (UVP)'
          backgroundColor='bg-the-lavender'
          impacts={getImpactsForSection('UVP')}
        />
        <CanvasSection
          title='Customer Relationship (CR)'
          backgroundColor='bg-the-yellow'
          impacts={getImpactsForSection('CR')}
        />
        <CanvasSection
          title='Customer Segment (CS)'
          backgroundColor='bg-the-yellow'
          impacts={getImpactsForSection('CS')}
        />
      </div>

      <div className='grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr] gap-3 flex-1 min-h-0'>
        {/* Second Row */}
        <CanvasSection
          title='Waste Management (WM)'
          backgroundColor='bg-the-light-blue'
          impacts={getImpactsForSection('WM')}
        />
        <CanvasSection
          title='Key Technology & Resources (KTR)'
          backgroundColor='bg-the-light-blue'
          impacts={getImpactsForSection('KTR')}
        />

        {/* Cost and Revenue Column */}
        <div className='flex flex-col gap-3'>
          <CanvasSection
            title='Cost (CO)'
            backgroundColor='bg-the-orange'
            className='flex-1'
            impacts={getImpactsForSection('CO')}
          />
          <CanvasSection
            title='Revenue (RE)'
            backgroundColor='bg-the-green'
            className='flex-1'
            impacts={getImpactsForSection('RE')}
          />
        </div>

        <CanvasSection
          title='Channels (CH)'
          backgroundColor='bg-the-yellow'
          impacts={getImpactsForSection('CH')}
        />
        <CanvasSection
          title='Governance (GO)'
          backgroundColor='bg-the-yellow'
          impacts={getImpactsForSection('GO')}
        />
      </div>
    </div>
  );
}
