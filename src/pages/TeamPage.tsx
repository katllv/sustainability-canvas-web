import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Trash2 } from 'lucide-react';
import { useParams } from '@tanstack/react-router';
import { useProjectCollaborators, useAddCollaborator, useRemoveCollaborator } from '@/api/profiles';
import { toast } from 'sonner';

type Collaborator = {
  id: number;
  profileId: number;
  projectId: number;
  profile?: {
    id?: number;
    userId?: number;
    name?: string;
    profileUrl?: string;
    user?: {
      email?: string;
    };
  };
};

export default function TeamPage() {
  const { projectId } = useParams({ from: '/app-layout/projects/$projectId' });
  const { data: collaborators = [], isLoading } = useProjectCollaborators(projectId);
  const addCollaboratorMutation = useAddCollaborator();
  const removeCollaboratorMutation = useRemoveCollaborator();
  const [email, setEmail] = useState('');

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

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      await removeCollaboratorMutation.mutateAsync(collaboratorId);
      toast.success('Collaborator removed');
    } catch (err) {
      console.error('Error removing collaborator:', err);
      toast.error('Failed to remove collaborator');
    }
  };

  const getCollaboratorInfo = (collaborator: Collaborator) => {
    const profile = collaborator.profile;
    const email = profile?.user?.email;
    const name = profile?.name;
    const initials =
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() ||
      email?.[0]?.toUpperCase() ||
      '?';

    return {
      name: name || 'Unknown User',
      email: email || 'No email',
      initials,
      profileUrl: profile?.profileUrl,
    };
  };

  return (
    <div>
      <h2>Team</h2>
      <div className='mt-6 bg-white p-6 rounded-xl'>
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
            {(collaborators as Collaborator[]).map((collaborator) => {
              const info = getCollaboratorInfo(collaborator);

              return (
                <div
                  key={collaborator.id}
                  className='p-4 flex items-center justify-between bg-the-light-grey rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={info.profileUrl} />
                      <AvatarFallback>{info.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-medium'>{info.name}</div>
                      <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                        <Mail className='h-3 w-3' />
                        {info.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveCollaborator(String(collaborator.id))}
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
    </div>
  );
}
