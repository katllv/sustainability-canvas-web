import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CollaboratorsPage() {
  return (
    <div>
      <h1>Collaborators Page</h1>
      <p className='mb-4'>This will be the collaborators page.</p>
      <Button onClick={() => toast('Hello from the collaborators page!')}>
        Click here for toast!
      </Button>
    </div>
  );
}
