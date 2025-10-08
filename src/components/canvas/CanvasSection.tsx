import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CanvasSectionProps {
  title: string;
  description?: string;
  className?: string;
  backgroundColor?: string;
}

export function CanvasSection({
  title,
  description,
  className = '',
  backgroundColor = 'bg-card',
}: CanvasSectionProps) {
  return (
    <Card className={`${backgroundColor} h-full ${className}`}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='pt-0'>
        {description && <p className='text-xs text-muted-foreground mb-3'>{description}</p>}
        <div className='min-h-[80px] text-sm'>{/* Content area for user input */}</div>
      </CardContent>
    </Card>
  );
}
