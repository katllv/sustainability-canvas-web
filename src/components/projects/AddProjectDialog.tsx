import { useAuth } from '@/lib/auth';
import { createProject } from '@/api/projects';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export function AddProjectDialog() {
  const { profile } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async () => {
    if (!profile || !projectName.trim()) return;

    setLoading(true);
    try {
      const data = await createProject({
        // 1) make sure this is a number
        profileId: Number(profile.id),
        title: projectName.trim(),
        description: description.trim() || undefined,
      });

      toast.success(`Project "${projectName}" created successfully!`);
      setOpen(false);
      setProjectName('');
      setDescription('');

      // 2) use route path + params for TanStack Router
      router.navigate({
        to: '/projects/$projectId/canvas',
        params: { projectId: String((data as any).id) },
      });
    } catch (error) {
      toast.error('Failed to create project');
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='has-[>svg]:px-5 rounded-full'>
          Add project <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>Enter the details for your new project below.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='project-name'>Project Name</Label>
            <Input
              id='project-name'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder='Enter project name'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='description'>Description (optional)</Label>
            <Input
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter project description'
            />
          </div>
        </div>
        <div className='flex justify-end space-x-2'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={!projectName.trim() || loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
