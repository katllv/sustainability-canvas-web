import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Props = {
  totalEntries: number;
  sdgsCovered: number;
  activeDimensions: number;
};

export default function AnalysisSummaryCards({
  totalEntries,
  sdgsCovered,
  activeDimensions,
}: Props) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-gray-500'>Total Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-semibold text-the-dark-blue'>{totalEntries}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-gray-500'>SDGs Covered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-semibold text-the-dark-blue'>{sdgsCovered}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-gray-500'>Active Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-semibold text-the-dark-blue'>{activeDimensions}</div>
        </CardContent>
      </Card>
    </div>
  );
}
