import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateProject } from '@/api/projects';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface EditProjectTitleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentTitle: string;
}

export function EditProjectTitleDialog({
  open,
  onOpenChange,
  projectId,
  currentTitle,
}: EditProjectTitleDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const updateProject = useUpdateProject();

  useEffect(() => {
    if (open) {
      setTitle(currentTitle);
    }
  }, [open, currentTitle]);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    updateProject.mutate(
      {
        id: projectId,
        updates: { title: title.trim() },
      },
      {
        onSuccess: () => {
          toast.success('Project title updated successfully');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Failed to update project title');
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Project Title</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className='space-y-4 py-4'>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Enter project title'
              autoFocus
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || updateProject.isPending}>
                {updateProject.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
