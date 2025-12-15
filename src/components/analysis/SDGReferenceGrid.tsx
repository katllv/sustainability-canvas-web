import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { sdgReference, sdgColors } from '@/lib/analysis-constants';

type SDGCount = {
  sdg: number;
  count: number;
};

type Props = {
  sdgCounts: SDGCount[];
};

export default function SDGReferenceGrid({ sdgCounts }: Props) {
  const sdgReferenceWithCounts = sdgReference.map((sdg) => {
    const countData = sdgCounts.find((item) => item.sdg === sdg.id);
    return {
      ...sdg,
      count: countData?.count || 0,
    };
  });

  return (
    <Card className='print:break-inside-avoid'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm text-the-dark-blue'>SDG Reference</CardTitle>
        <p className='text-xs text-gray-500'>Complete list of Sustainable Development Goals</p>
      </CardHeader>
      <CardContent>
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {sdgReferenceWithCounts.map((sdg) => (
            <div
              key={sdg.id}
              className='flex items-center justify-between rounded-xl border px-3 py-2 bg-white'>
              <div className='flex items-center gap-2'>
                <span
                  className='w-3 h-3 rounded-full'
                  style={{
                    backgroundColor: sdgColors[(sdg.id - 1) % sdgColors.length],
                  }}
                />
                <div>
                  <div className='text-xs font-semibold text-the-dark-blue'>SDG {sdg.id}</div>
                  <div className='text-[11px] text-gray-500'>{sdg.name}</div>
                </div>
              </div>
              <div className='inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-[11px] text-gray-700'>
                {sdg.count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
