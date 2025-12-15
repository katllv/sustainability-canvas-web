import { Download, Printer } from 'lucide-react';
import { useParams } from '@tanstack/react-router';
import { useProjectAnalysis } from '@/api/analysis';
import { Spinner } from '@/components/ui/spinner';
import {
  AnalysisSummaryCards,
  PieChartWithLegend,
  SDGBarChart,
  SDGReferenceGrid,
} from '@/components/analysis';
import { impactColors, dimensionColors } from '@/lib/analysis-constants';

export default function AnalysisPage() {
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });
  const { data: analysisData, isLoading: loading, error } = useProjectAnalysis(projectId);

  function handlePrint() {
    window.print();
  }

  async function handleDownloadExcel() {
    // Placeholder for Excel download functionality
    alert('Excel download functionality is not yet implemented.');
  }

  if (loading) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex items-center gap-3 mb-6'>
          <Spinner size='lg' />
          <h2>Loading analysis...</h2>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <p className='text-red-600'>Failed to load analysis data</p>
          <p className='text-sm text-gray-500 mt-2'>Please try again later</p>
        </div>
      </div>
    );
  }

  const { summary, impactDistribution, dimensionDistribution, sdgCounts } = analysisData;

  return (
    <div className='flex flex-col h-full print:block'>
      <div className='flex items-baseline justify-between mb-6 flex-shrink-0 print:hidden'>
        <div className='flex items-baseline gap-3'>
          <h2>Project Analysis</h2>
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

      <div className='flex-1 min-h-0 space-y-6'>
        <AnalysisSummaryCards
          totalEntries={summary.totalEntries}
          sdgsCovered={summary.sdgsCovered}
          activeDimensions={summary.activeDimensions}
        />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <PieChartWithLegend
            title='Impact Distribution'
            description='Distribution of impact types across entries'
            data={impactDistribution}
            colors={impactColors}
          />

          <PieChartWithLegend
            title='Dimension Distribution'
            description='Distribution across dimensions'
            data={dimensionDistribution}
            colors={dimensionColors}
          />
        </div>

        <SDGBarChart sdgCounts={sdgCounts} />

        <SDGReferenceGrid sdgCounts={sdgCounts} />
      </div>
    </div>
  );
}
