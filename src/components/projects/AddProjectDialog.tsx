import { useAuth } from '@/lib/auth';
import { useCreateProject } from '@/api/projects';
import { useAddCollaborator } from '@/api/profiles';
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

interface Collaborator {
  email: string;
}

function getInitialsFromEmail(email: string) {
  const [local] = email.split('@');
  const parts = local.split(/[.\-_]/).filter(Boolean);
  if (parts.length === 0) return email.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getNameFromEmail(email: string) {
  const [local] = email.split('@');
  const parts = local.split(/[.\-_]/).filter(Boolean);
  if (!parts.length) return email;
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

export function AddProjectDialog() {
  const { profile } = useAuth();
  const router = useRouter();

  const createProjectMutation = useCreateProject();
  const addCollaboratorMutation = useAddCollaborator();

  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddCollaborator = () => {
    const email = collaboratorInput.trim();

    if (!email) {
      return;
    }

    if (collaborators.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
      setCollaboratorInput('');
      return;
    }

    setCollaborators((prev) => {
      const updated = [...prev, { email }];
      return updated;
    });
    setCollaboratorInput('');
  };

  const handleRemoveCollaborator = (email: string) => {
    setCollaborators((prev) => prev.filter((c) => c.email !== email));
  };

  const handleCreateProject = async () => {
    if (!profile || !projectName.trim()) return;

    setLoading(true);
    try {
      // Step 1: Create the project
      const projectData = {
        profileId: Number(profile.id),
        title: projectName.trim(),
        description: description.trim() || undefined,
      };

      const project = await createProjectMutation.mutateAsync(projectData);

      const projectId = String(project.id);

      // Step 2: Add collaborators one by one
      if (collaborators.length > 0) {
        const collaboratorResults = [];
        let failedCount = 0;

        for (const c of collaborators) {
          try {
            const result = await addCollaboratorMutation.mutateAsync({
              projectId,
              email: c.email,
            });
            collaboratorResults.push(result);
          } catch (collabError: any) {
            failedCount++;
            console.error(`Failed to add collaborator ${c.email}:`, collabError);
            console.error('Error details:', collabError.message);
          }
        }

        if (failedCount === 0) {
          toast.success(
            `Project "${projectName}" created with ${collaborators.length} collaborator(s)!`,
          );
        } else if (failedCount < collaborators.length) {
          toast.warning(
            `Project created! ${collaborators.length - failedCount} of ${collaborators.length} collaborators added.`,
          );
        } else {
          toast.warning(
            `Project created, but could not add any collaborators. They may not have accounts yet.`,
          );
        }
      } else {
        toast.success(`Project "${projectName}" created successfully!`);
      }

      // Reset form and close dialog
      setOpen(false);
      setProjectName('');
      setDescription('');
      setCollaborators([]);

      // Navigate to the new project
      router.navigate({
        to: '/projects/$projectId/canvas',
        params: { projectId },
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

      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-xl font-semibold text-the-dark-blue'>
            Create New Project
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-500'>
            Add a new project and invite collaborators to work together.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-5 py-4'>
          {/* Project name */}
          <div className='grid gap-2'>
            <Label
              htmlFor='project-name'
              className='text-sm font-medium text-gray-800'>
              Project Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='project-name'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder='Enter project name'
            />
          </div>

          {/* Collaborators */}
          <div className='grid gap-2'>
            <Label
              htmlFor='collaborators'
              className='text-sm font-medium text-gray-800'>
              Add collaborators
            </Label>
            <div className='flex gap-2'>
              <Input
                id='collaborators'
                value={collaboratorInput}
                onChange={(e) => setCollaboratorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCollaborator();
                  }
                }}
                placeholder='Enter collaborators email'
              />
              <Button
                type='button'
                size='icon'
                onClick={handleAddCollaborator}
                disabled={!collaboratorInput.trim()}
                className='shrink-0'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {collaborators.length > 0 && (
              <div className='mt-4 rounded-2xl border border-gray-200 overflow-hidden bg-white'>
                {collaborators.map((c, idx) => (
                  <div
                    key={c.email}
                    className={`flex items-center justify-between px-4 py-3 ${
                      idx !== 0 ? 'border-t border-gray-100' : ''
                    }`}>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#E2EBFF] text-xs font-semibold text-[#4C6FFF]'>
                        {getInitialsFromEmail(c.email)}
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-gray-800'>
                          {getNameFromEmail(c.email)}
                        </span>
                        <span className='text-xs text-gray-500'>{c.email}</span>
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='rounded-full px-4 text-xs'
                      onClick={() => handleRemoveCollaborator(c.email)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-2'>
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
