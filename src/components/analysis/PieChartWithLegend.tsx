import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const nInnerRadius = Number(innerRadius);
  const nOuterRadius = Number(outerRadius);
  const radius = nInnerRadius + (nOuterRadius - nInnerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      dominantBaseline='central'
      fontSize={12}
      fontWeight='bold'>
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

type DistributionData = {
  name: string;
  value: number;
};

type Props = {
  title: string;
  description: string;
  data: DistributionData[];
  colors: string[] | Record<string, string>;
};

export default function PieChartWithLegend({ title, description, data, colors }: Props) {
  const getColor = (entry: DistributionData, index: number) => {
    if (Array.isArray(colors)) {
      return colors[index];
    } else {
      return colors[entry.name] || '#cccccc';
    }
  };

  return (
    <Card className='h-[320px]'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm text-the-dark-blue'>{title}</CardTitle>
        <p className='text-xs text-gray-500'>{description}</p>
      </CardHeader>
      <CardContent className='h-full flex flex-col'>
        <div className='flex-1 flex items-center justify-center w-full min-w-0'>
          <ResponsiveContainer
            width='100%'
            height='100%'>
            <PieChart>
              <Pie
                data={data}
                dataKey='value'
                nameKey='name'
                outerRadius={80}
                labelLine={false}
                label={renderCustomizedLabel}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={getColor(entry, index)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='flex flex-wrap gap-2 mt-4'>
          {data.map((d, i) => {
            const color = getColor(d, i);
            return (
              <span
                key={d.name}
                className='inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs'
                style={{ backgroundColor: `${color}22` }}>
                <span
                  className='w-2 h-2 rounded-full'
                  style={{ backgroundColor: color }}
                />
                {d.name}: {d.value}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
