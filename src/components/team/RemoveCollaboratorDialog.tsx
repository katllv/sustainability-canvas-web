import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RemoveCollaboratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorName: string;
  onConfirm: () => void;
}

export function RemoveCollaboratorDialog({
  open,
  onOpenChange,
  collaboratorName,
  onConfirm,
}: RemoveCollaboratorDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Collaborator</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{collaboratorName}</strong> from this project?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
