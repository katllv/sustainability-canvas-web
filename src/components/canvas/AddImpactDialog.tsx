import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateImpact, useDeleteImpact, useUpdateImpact } from '@/api/impacts';
import type { SectionType, Impact, SDGId } from '@/api/impacts';
import ImpactForm from './ImpactForm';
import ImpactList from './ImpactList';
import { SECTION_QUESTIONS, SECTION_TITLES } from '@/lib/section-questions';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  sectionKey: SectionType;
  existingImpacts: Impact[];
  onCreated?: (impact: Impact) => void;
  backgroundColor?: string;
};

export default function AddImpactDialog({
  open,
  onOpenChange,
  projectId,
  sectionKey,
  existingImpacts,
  onCreated,
  backgroundColor = '',
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [relationType, setRelationType] = useState('Direct');
  const [dimension, setDimension] = useState('Environmental');
  const [sdgs, setSdgs] = useState<SDGId[]>([]);
  const [score, setScore] = useState('');

  const [savingId, setSavingId] = useState<number | undefined>();
  const [deletingId, setDeletingId] = useState<number | undefined>();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const createImpactMutation = useCreateImpact();
  const updateImpactMutation = useUpdateImpact();
  const deleteImpactMutation = useDeleteImpact();

  useEffect(() => {
    if (existingImpacts.length === 0) {
      setShowForm(true);
    }
  }, [existingImpacts.length]);

  useEffect(() => {
    if (showForm && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        setTimeout(() => {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [showForm]);

  const handleAddEntry = () => {
    setShowForm(true);
  };

  const handleSaveNewEntry = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!score) {
      toast.error('Impact score is required');
      return;
    }

    try {
      const impact = await createImpactMutation.mutateAsync({
        projectId: parseInt(projectId),
        title,
        type: sectionKey,
        relation: relationType as 'Direct' | 'Indirect' | 'Hidden',
        dimension: dimension as 'Environmental' | 'Social' | 'Economic',
        score: parseInt(score) as 1 | 2 | 3 | 4 | 5,
        description: description || undefined,
        sdgIds: sdgs,
      });

      if (impact?.id) {
        toast.success('Impact added');
        onCreated?.(impact);
        // Reset form
        setTitle('');
        setDescription('');
        setRelationType('Direct');
        setDimension('Environmental');
        setSdgs([]);
        setScore('');
        setShowForm(false);

        // Scroll to bottom after adding
        if (scrollAreaRef.current) {
          const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (viewport) {
            setTimeout(() => {
              viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }, 100);
          }
        }
      }
    } catch (err) {
      console.error('Error creating impact:', err);
      toast.error('Error creating impact');
    }
  };

  const handleCancelNewEntry = () => {
    setShowForm(false);
    setTitle('');
    setDescription('');
    setRelationType('Direct');
    setDimension('Environmental');
    setSdgs([]);
    setScore('');
  };

  const handleSaveImpact = (impactId: number, updates: Partial<Impact>) => {
    setSavingId(impactId);
    updateImpactMutation.mutate(
      { id: impactId, updates },
      {
        onSuccess: () => {
          toast.success('Impact updated');
          setSavingId(undefined);
        },
        onError: () => {
          toast.error('Failed to update impact');
          setSavingId(undefined);
        },
      },
    );
  };

  const handleDeleteImpact = (impactId: number) => {
    setDeletingId(impactId);
    deleteImpactMutation.mutate(impactId, {
      onSuccess: () => {
        toast.success('Impact deleted');
        setDeletingId(undefined);
      },
      onError: () => {
        toast.error('Failed to delete impact');
        setDeletingId(undefined);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-5xl max-h-[90vh] overflow-y-auto ${backgroundColor}`}>
        <DialogHeader className='space-y-1 pb-4'>
          <div className='flex items-center gap-2'>
            <DialogTitle className='text-2xl font-semibold'>
              {SECTION_TITLES[sectionKey]}
            </DialogTitle>
            {SECTION_QUESTIONS[sectionKey] && SECTION_QUESTIONS[sectionKey].length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-muted/80 cursor-help'>
                      <Info className='h-4 w-4 text-muted-foreground' />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side='right'
                    className='max-w-md'>
                    <div className='space-y-2'>
                      <p className='font-semibold text-sm'>Guiding Questions:</p>
                      <ul className='space-y-1 text-xs list-disc pl-4'>
                        {SECTION_QUESTIONS[sectionKey].map((question, idx) => (
                          <li key={idx}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <DialogDescription className='text-sm text-muted-foreground'>
            Add and manage entries for this section
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          className='max-h-[60vh] pr-4'
          ref={scrollAreaRef}>
          <div className='space-y-6'>
            {/* Existing Impacts */}
            {existingImpacts.length > 0 && (
              <ImpactList
                impacts={existingImpacts}
                onSave={handleSaveImpact}
                onDelete={handleDeleteImpact}
                savingId={savingId}
                deletingId={deletingId}
              />
            )}

            {/* New Entry Form - only shown when showForm is true */}
            {showForm && (
              <div className='space-y-3'>
                <ImpactForm
                  title={title}
                  description={description}
                  relationType={relationType}
                  dimension={dimension}
                  sdgs={sdgs}
                  score={score}
                  onTitleChange={setTitle}
                  onDescriptionChange={setDescription}
                  onRelationTypeChange={setRelationType}
                  onDimensionChange={setDimension}
                  onSdgsChange={setSdgs}
                  onScoreChange={setScore}
                />
                {/* Action Buttons Below Form */}
                <div className='flex justify-end'>
                  <div className='gap-2 flex bg-white/40 p-2 rounded-b-xl'>
                    <Button
                      variant='default'
                      onClick={handleSaveNewEntry}
                      disabled={createImpactMutation.isPending}
                      className=''>
                      {createImpactMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={handleCancelNewEntry}
                      disabled={createImpactMutation.isPending}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Buttons */}
        <div className='flex justify-end gap-3 pt-6 border-t'>
          <Button
            variant='default'
            onClick={handleAddEntry}
            disabled={showForm}
            className='bg-white hover:bg-gray-50 text-gray-700 border'>
            Add Entry
          </Button>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='default'>Save All Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
