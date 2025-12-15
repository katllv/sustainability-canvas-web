import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Impact } from '@/api/impacts';

interface CanvasSectionProps {
  title: string;
  description?: string;
  className?: string;
  backgroundColor?: string;
  impacts?: Impact[];
  onClick?: () => void;
}

export function CanvasSection({
  title,
  className = '',
  backgroundColor = 'bg-card',
  impacts = [],
  onClick,
}: CanvasSectionProps) {
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div className='h-full min-h-0 max-h-full flex overflow-hidden'>
      <Card
        className={`${backgroundColor} w-full flex flex-col min-h-0 ${className} ${clickableClass}`}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (!onClick) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        data-section-title={title}>
        <CardHeader className='pb-2 flex-shrink-0'>
          <CardTitle className='text-sm'>{title}</CardTitle>
        </CardHeader>
        <CardContent className='flex-1 min-h-0 p-0'>
          <ScrollArea className='h-full px-4 pb-6'>
            <div className='space-y-2'>
              {impacts.length > 0 ? (
                impacts.map((impact) => {
                  // Determine score indicator
                  const scoreIndicator = impact.score >= 4 ? '+' : impact.score <= 2 ? '-' : '0';
                  // Dimension abbreviation
                  const dimensionShort =
                    impact.dimension === 'Environmental'
                      ? 'E'
                      : impact.dimension === 'Social'
                        ? 'S'
                        : 'Ec';
                  // Relation type abbreviation
                  const relationType =
                    impact.relation === 'Direct' ? 'D' : impact.relation === 'Indirect' ? 'I' : 'H';
                  // SDGs
                  const sdgList = impact.impactSdgs
                    ?.map((sdg) => sdg.sdgId || sdg.id)
                    .filter((id): id is number => id !== undefined)
                    .sort((a, b) => a - b)
                    .join('/');

                  // Show only first 3 SDGs if list is long
                  const sdgDisplay =
                    sdgList && sdgList.split('/').length > 3
                      ? sdgList.split('/').slice(0, 3).join('/') + '/...'
                      : sdgList;

                  return (
                    <div
                      key={impact.id}
                      className='text-xs'>
                      <span>[{relationType}]</span>
                      <span className=''> • </span>
                      <span className='font-medium'>{dimensionShort}</span>
                      <span className=''> • </span>
                      <span className='font-semibold'>{scoreIndicator}</span>
                      <span className=''> • </span>
                      <span>{impact.title}</span>
                      {sdgDisplay && (
                        <>
                          <span className=''> • </span>
                          <span className=''>SDG {sdgDisplay}</span>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className='text-xs text-gray-500 italic' />
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
