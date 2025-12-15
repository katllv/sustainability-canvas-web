import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { sdgColors } from '@/lib/analysis-constants';

type SDGCount = {
  sdg: number;
  count: number;
};

type Props = {
  sdgCounts: SDGCount[];
};

export default function SDGBarChart({ sdgCounts }: Props) {
  const sdgBarData = sdgCounts.map((item) => ({
    sdg: `SDG ${item.sdg}`,
    count: item.count,
  }));

  return (
    <Card className='print:break-inside-avoid'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm text-the-dark-blue'>
          Sustainable Development Goals (SDGs)
        </CardTitle>
        <p className='text-xs text-gray-500'>Number of entries per SDG</p>
      </CardHeader>
      <CardContent>
        <div className='w-full min-w-0'>
          <ResponsiveContainer
            width='100%'
            height={280}
            minWidth={0}>
            <BarChart data={sdgBarData}>
              <XAxis
                dataKey='sdg'
                tick={{ fontSize: 10 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey='count'
                radius={[4, 4, 0, 0]}>
                {sdgBarData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={sdgColors[index % sdgColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
