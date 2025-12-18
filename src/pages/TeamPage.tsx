import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Trash2 } from 'lucide-react';
import { useParams, useRouter } from '@tanstack/react-router';
import { useProjectCollaborators, useAddCollaborator, useRemoveCollaborator } from '@/api/profiles';
import { toast } from 'sonner';
import { RemoveCollaboratorDialog } from '@/components/team';

type Collaborator = {
  id: number;
  profileId?: number;
  name?: string;
  email: string;
  profileUrl?: string;
};

export default function TeamPage() {
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });
  const router = useRouter();
  const { data: collaborators = [], isLoading } = useProjectCollaborators(projectId);
  const addCollaboratorMutation = useAddCollaborator();
  const removeCollaboratorMutation = useRemoveCollaborator();
  const [email, setEmail] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collaboratorToDelete, setCollaboratorToDelete] = useState<{
    profileId: string;
    name: string;
  } | null>(null);

  const handleAddCollaborator = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await addCollaboratorMutation.mutateAsync({ projectId, email: email.trim() });
      toast.success('Collaborator added');
      setEmail('');
    } catch (err) {
      console.error('Error adding collaborator:', err);
      toast.error('Failed to add collaborator');
    }
  };

  const handleRemoveCollaborator = async (profileId: string) => {
    try {
      const result = await removeCollaboratorMutation.mutateAsync({ projectId, profileId });

      // Check if the project was deleted (when last collaborator is removed)
      if (result?.projectDeleted) {
        toast.success('Last collaborator removed. Project has been deleted.');
        router.navigate({ to: '/projects' });
      } else {
        toast.success('Collaborator removed');
      }

      setDeleteDialogOpen(false);
      setCollaboratorToDelete(null);
    } catch (err) {
      console.error('Error removing collaborator:', err);
      toast.error('Failed to remove collaborator');
    }
  };

  const openDeleteDialog = (profileId: string, name: string) => {
    setCollaboratorToDelete({ profileId, name });
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <h2>Team</h2>
      <div className='mt-6 bg-white p-6 rounded-xl'>
        <div className='max-w-6xl mx-auto'>
          <p className=''>Team Collaborators</p>
          <div className='flex gap-2 my-4'>
            <Input
              placeholder='Add team member by email'
              className='flex-1 mt-2 '
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCollaborator()}
            />
            <Button
              variant='default'
              className='mt-2'
              onClick={handleAddCollaborator}
              disabled={addCollaboratorMutation.isPending}>
              {addCollaboratorMutation.isPending ? 'Adding...' : 'Add'}
            </Button>
          </div>

          {isLoading ? (
            <div className='mt-4 text-muted-foreground'>Loading collaborators...</div>
          ) : collaborators.length === 0 ? (
            <div className='mt-4 text-muted-foreground'>No collaborators yet</div>
          ) : (
            <div className='mt-4 space-y-3'>
              {collaborators.map((collaborator: Collaborator) => {
                const name = collaborator.name || collaborator.email.split('@')[0] || 'User';
                const initials = (() => {
                  const letters =
                    name
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || 'U';

                  return letters.length > 2 ? letters[0] + letters[letters.length - 1] : letters;
                })();

                return (
                  <div
                    key={collaborator.profileId || collaborator.id || collaborator.email}
                    className='p-4 flex items-center justify-between bg-the-light-grey rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarImage src={collaborator.profileUrl} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>{name}</div>
                        <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                          <Mail className='h-3 w-3' />
                          {collaborator.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => openDeleteDialog(String(collaborator.profileId), name)}
                      disabled={removeCollaboratorMutation.isPending}
                      className='text-destructive hover:text-destructive hover:bg-destructive/10'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <RemoveCollaboratorDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          collaboratorName={collaboratorToDelete?.name || ''}
          onConfirm={() =>
            collaboratorToDelete && handleRemoveCollaborator(collaboratorToDelete.profileId)
          }
        />
      </div>
    </div>
  );
}
