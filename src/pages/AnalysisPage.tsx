import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const summaryStats = {
  totalEntries: 100,
  sdgsCovered: 17,
  activeCategories: 3,
};

const impactDistributionData = [
  { name: 'Direct', value: 45 },
  { name: 'Indirect', value: 32 },
  { name: 'Hidden', value: 23 },
];

const impactColors = ['#4ade80', '#60a5fa', '#c4b5fd'];

const categoryDistributionData = [
  { name: 'Social', value: 38 },
  { name: 'Economic', value: 35 },
  { name: 'Ecological', value: 27 },
];

const categoryColors = ['#60a5fa', '#fb923c', '#4ade80'];

const sdgColors = [
  '#e5243b',
  '#dda63a',
  '#4c9f38',
  '#c5192d',
  '#ff3a21',
  '#26bde2',
  '#fcc30b',
  '#a21942',
  '#fd6925',
  '#dd1367',
  '#fd9d24',
  '#bf8b2e',
  '#3f7e44',
  '#0a97d9',
  '#56c02b',
  '#00689d',
  '#19486a',
];

const sdgBarData = [
  { sdg: 'SDG 1', count: 11 },
  { sdg: 'SDG 2', count: 8 },
  { sdg: 'SDG 3', count: 15 },
  { sdg: 'SDG 4', count: 20 },
  { sdg: 'SDG 5', count: 10 },
  { sdg: 'SDG 6', count: 7 },
  { sdg: 'SDG 7', count: 9 },
  { sdg: 'SDG 8', count: 18 },
  { sdg: 'SDG 9', count: 14 },
  { sdg: 'SDG 10', count: 11 },
  { sdg: 'SDG 11', count: 13 },
  { sdg: 'SDG 12', count: 6 },
  { sdg: 'SDG 13', count: 22 },
  { sdg: 'SDG 14', count: 5 },
  { sdg: 'SDG 15', count: 16 },
  { sdg: 'SDG 16', count: 9 },
  { sdg: 'SDG 17', count: 19 },
];

const sdgReference = [
  { id: 1, name: 'No Poverty', count: 12 },
  { id: 2, name: 'Zero Hunger', count: 8 },
  { id: 3, name: 'Good Health', count: 15 },
  { id: 4, name: 'Quality Education', count: 20 },
  { id: 5, name: 'Gender Equality', count: 10 },
  { id: 6, name: 'Clean Water', count: 7 },
  { id: 7, name: 'Affordable Energy', count: 9 },
  { id: 8, name: 'Decent Work', count: 18 },
  { id: 9, name: 'Industry & Innovation', count: 14 },
  { id: 10, name: 'Reduced Inequalities', count: 11 },
  { id: 11, name: 'Sustainable Cities', count: 13 },
  { id: 12, name: 'Responsible Consumption', count: 6 },
  { id: 13, name: 'Climate Action', count: 22 },
  { id: 14, name: 'Life Below Water', count: 5 },
  { id: 15, name: 'Life on Land', count: 16 },
  { id: 16, name: 'Peace & Justice', count: 9 },
  { id: 17, name: 'Partnerships', count: 19 },
];

export default function AnalysisPage() {
  // const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });
  // later: use projectId to fetch real stats

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between mb-6 flex-shrink-0'>
        <div className='flex items-baseline gap-3'>
          <h2 className='text-2xl font-semibold text-the-dark-blue'>Project Analysis</h2>
        </div>
        <div className='flex gap-2'>
          <Printer />
          <Download />
        </div>
      </div>

      <div className='flex-1 min-h-0 space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-medium text-gray-500'>Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-semibold text-the-dark-blue'>
                {summaryStats.totalEntries}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-medium text-gray-500'>SDGs Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-semibold text-the-dark-blue'>
                {summaryStats.sdgsCovered}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-medium text-gray-500'>Active Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-semibold text-the-dark-blue'>
                {summaryStats.activeCategories}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <Card className='h-[320px]'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-the-dark-blue'>Impact Distribution</CardTitle>
              <p className='text-xs text-gray-500'>Distribution of impact types across entries</p>
            </CardHeader>
            <CardContent className='h-full flex flex-col'>
              <div className='flex-1 flex items-center justify-center w-full min-w-0'>
                <ResponsiveContainer
                  width='100%'
                  height='100%'>
                  <PieChart>
                    <Pie
                      data={impactDistributionData}
                      dataKey='value'
                      nameKey='name'
                      outerRadius={90}>
                      {impactDistributionData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={impactColors[index]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='flex flex-wrap gap-2 mt-4'>
                {impactDistributionData.map((d, i) => (
                  <span
                    key={d.name}
                    className='inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs'
                    style={{ backgroundColor: `${impactColors[i]}22` }}>
                    <span
                      className='w-2 h-2 rounded-full'
                      style={{ backgroundColor: impactColors[i] }}
                    />
                    {d.name}: {d.value}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className='h-[320px]'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm text-the-dark-blue'>Category Distribution</CardTitle>
              <p className='text-xs text-gray-500'>Distribution across categories</p>
            </CardHeader>
            <CardContent className='h-full flex flex-col'>
              <div className='flex-1 flex items-center justify-center w-full min-w-0'>
                <ResponsiveContainer
                  width='100%'
                  height='100%'>
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      dataKey='value'
                      nameKey='name'
                      outerRadius={90}>
                      {categoryDistributionData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={categoryColors[index]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='flex flex-wrap gap-2 mt-4'>
                {categoryDistributionData.map((d, i) => (
                  <span
                    key={d.name}
                    className='inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs'
                    style={{ backgroundColor: `${categoryColors[i]}22` }}>
                    <span
                      className='w-2 h-2 rounded-full'
                      style={{ backgroundColor: categoryColors[i] }}
                    />
                    {d.name}: {d.value}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-the-dark-blue'>
              Sustainable Development Goals (SDGs)
            </CardTitle>
            <p className='text-xs text-gray-500'>Number of entries per SDG</p>
          </CardHeader>
          <CardContent>
            {/* fixed-height container so Recharts always has >0 height */}
            <div className='w-full min-w-0'>
              <ResponsiveContainer
                width='100%'
                height={280} // <- key change
                minWidth={0}>
                <BarChart data={sdgBarData}>
                  <XAxis
                    dataKey='sdg'
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis />
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

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-the-dark-blue'>SDG Reference</CardTitle>
            <p className='text-xs text-gray-500'>Complete list of Sustainable Development Goals</p>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
              {sdgReference.map((sdg) => (
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
      </div>
    </div>
  );
}
