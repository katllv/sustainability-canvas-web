import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { createProject } from '@/api/projects';
import { useNavigate } from 'react-router';

export function AddProjectDialog() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async () => {
    if (!profile || !projectName.trim()) return;

    setLoading(true);
    try {
      const data = await createProject({
        userId: profile.id,
        title: projectName.trim(),
        description: description.trim() || undefined,
      });

      toast.success(`Project "${projectName}" created successfully!`);
      setOpen(false);
      setProjectName('');
      setDescription('');
      // Navigate to the new project's canvas
      // `data` is expected to be the created project returned by the API
      navigate(`/project/${(data as any).id}/canvas`);
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
        <Button className='has-[>svg]:px-5'>
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
