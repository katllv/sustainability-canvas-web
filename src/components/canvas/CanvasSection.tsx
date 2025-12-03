import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  description,
  className = '',
  backgroundColor = 'bg-card',
  impacts = [],
  onClick,
}: CanvasSectionProps) {
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <Card
      className={`${backgroundColor} h-full ${className} ${clickableClass}`}
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
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {impacts.length > 0 ? (
            ['Direct', 'Indirect', 'Hidden'].map((relationType) => {
              const relatedImpacts = impacts.filter((impact) => impact.relation === relationType);
              if (relatedImpacts.length === 0) return null;

              return (
                <div key={relationType}>
                  <div className='text-xs font-medium text-gray-700 mb-1 lowercase'>
                    {relationType.toLowerCase()}:
                  </div>
                  <div className='space-y-1 ml-2'>
                    {relatedImpacts.map((impact) => (
                      <div
                        key={impact.id}
                        className='text-xs'>
                        <span>
                          {impact.score} {impact.dimension.toLowerCase()} - {impact.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className='text-xs text-gray-500 italic' />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
