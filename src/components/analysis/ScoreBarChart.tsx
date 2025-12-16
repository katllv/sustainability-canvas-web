import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { scoreColors } from '@/lib/analysis-constants';

type ScoreDistribution = {
  score: number;
  count: number;
};

type Props = {
  scoreDistribution: ScoreDistribution[];
};

export default function ScoreBarChart({ scoreDistribution }: Props) {
  // Ensure all scores 1-5 are present, even with 0 count
  const allScores = [1, 2, 3, 4, 5];
  const chartData = allScores.map((score) => {
    const existing = scoreDistribution.find((item) => item.score === score);
    return {
      score: `Score ${score}`,
      scoreValue: score,
      count: existing?.count || 0,
    };
  });

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm text-the-dark-blue'>Score Distribution</CardTitle>
        <p className='text-xs text-gray-500'>
          Distribution of impacts by score (1 - Negative to 5 - Positive)
        </p>
      </CardHeader>
      <CardContent>
        <div className='w-full min-w-0'>
          <ResponsiveContainer
            width='100%'
            height={280}
            minWidth={0}>
            <BarChart data={chartData}>
              <XAxis
                dataKey='score'
                tick={{ fontSize: 10 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey='count'
                radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={scoreColors[entry.scoreValue]}
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
