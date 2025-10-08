import { SustainabilityCanvas } from '@/components/canvas';
import { Button } from '@/components/ui/button';

export default function CanvasPage() {
  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Sustainability Canvas</h1>
          <p className='text-muted-foreground mt-1'>Design your sustainable business model</p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'>
            Save Canvas
          </Button>
          <Button size='sm'>Export PDF</Button>
        </div>
      </div>

      <SustainabilityCanvas />
    </div>
  );
}
