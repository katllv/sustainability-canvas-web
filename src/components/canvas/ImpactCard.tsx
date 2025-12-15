import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import SDGMultiSelect from './SDGMultiSelect';
import type { Impact, RelationType, Dimension, SDGId } from '@/api/impacts';

type ImpactCardProps = {
  impact: Impact;
  onSave: (id: number, updates: Partial<Impact>) => void;
  onDelete: (id: number) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
};

export default function ImpactCard({
  impact,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: ImpactCardProps) {
  const [title, setTitle] = useState(impact.title);
  const [description, setDescription] = useState(impact.description || '');
  const [relationType, setRelationType] = useState<RelationType>(impact.relation);
  const [dimension, setDimension] = useState<Dimension>(impact.dimension);
  const [sdgs, setSdgs] = useState<SDGId[]>(
    impact.impactSdgs?.map((sdg) => (sdg.sdgId || sdg.id) as SDGId).filter(Boolean) || [],
  );
  const [score, setScore] = useState(impact.score);
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check if there are unsaved changes
  const hasChanges =
    title !== impact.title ||
    description !== (impact.description || '') ||
    relationType !== impact.relation ||
    dimension !== impact.dimension ||
    score !== impact.score ||
    JSON.stringify([...sdgs].sort()) !==
      JSON.stringify(
        (
          impact.impactSdgs?.map((sdg) => (sdg.sdgId || sdg.id) as SDGId).filter(Boolean) || []
        ).sort(),
      );

  const showButtons = isActive || hasChanges;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;

      // Check if click is within a dropdown/portal
      const isInDropdown = target.closest('[role="listbox"], [data-radix-popper-content-wrapper]');

      if (cardRef.current && !cardRef.current.contains(target) && !isInDropdown) {
        // Don't deactivate if there are unsaved changes
        if (!hasChanges) {
          setIsActive(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hasChanges]);

  const handleSave = () => {
    onSave(impact.id, {
      title,
      description,
      type: impact.type,
      relation: relationType,
      dimension,
      score,
      sdgIds: sdgs,
    });
  };

  const handleCancel = () => {
    // Reset all fields to original values
    setTitle(impact.title);
    setDescription(impact.description || '');
    setRelationType(impact.relation);
    setDimension(impact.dimension);
    setSdgs(impact.impactSdgs?.map((sdg) => (sdg.sdgId || sdg.id) as SDGId).filter(Boolean) || []);
    setScore(impact.score);
    setIsActive(false);
  };

  return (
    <div
      className='space-y-3'
      ref={cardRef}>
      <Card
        className={`rounded-xl bg-white/40 p-6 mb-0 cursor-pointer ${showButtons ? 'rounded-br-none' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsActive(true);
        }}>
        <div className='grid grid-cols-[1fr_1fr_0.6fr] gap-4'>
          {/* First Column */}
          <div className='space-y-4'>
            {/* Title */}
            <div>
              <Label className='text-sm font-medium'>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter title'
                className='mt-1 bg-white'
              />
            </div>

            {/* Impact Type and Dimension */}
            <div className='grid grid-cols-[1fr_2fr] gap-4'>
              <div>
                <Label className='text-sm font-medium'>Type</Label>
                <Select
                  value={relationType}
                  onValueChange={(v) => setRelationType(v as RelationType)}>
                  <SelectTrigger className='mt-1 bg-white w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Direct'>Direct</SelectItem>
                    <SelectItem value='Indirect'>Indirect</SelectItem>
                    <SelectItem value='Hidden'>Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className='text-sm font-medium'>Dimension</Label>
                <Select
                  value={dimension}
                  onValueChange={(v) => setDimension(v as Dimension)}>
                  <SelectTrigger className='mt-1 bg-white w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Environmental'>E (Environmental)</SelectItem>
                    <SelectItem value='Social'>S (Social)</SelectItem>
                    <SelectItem value='Economic'>Ec (Economic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Second Column - Description (spans full height) */}
          <div className='min-w-0'>
            <Label className='text-sm font-medium'>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter description'
              className='mt-1 bg-white resize-none h-29 w-full break-words'
            />
          </div>

          {/* Third Column */}
          <div className='space-y-4'>
            {/* SDGs */}
            <SDGMultiSelect
              value={sdgs}
              onChange={setSdgs}
            />

            {/* Impact Score */}
            <div>
              <div className='flex items-center justify-between'>
                <Label className='text-sm font-medium'>Score</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted/80 cursor-help'>
                        <Info className='h-3 w-3 text-muted-foreground' />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side='right'
                      className='max-w-xs'>
                      <p className='text-xs'>
                        Rate the impact from negative (1) to positive (5) based on its effect on
                        sustainability.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={score.toString()}
                onValueChange={(v) => setScore(parseInt(v) as 1 | 2 | 3 | 4 | 5)}>
                <SelectTrigger className='mt-1 bg-white w-full'>
                  <SelectValue placeholder='Select from 1-5' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1'>1 - Negative</SelectItem>
                  <SelectItem value='2'>2 - Slightly negative</SelectItem>
                  <SelectItem value='3'>3 - Neutral</SelectItem>
                  <SelectItem value='4'>4 - Slightly positive</SelectItem>
                  <SelectItem value='5'>5 - Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons Below Card */}
      {showButtons && (
        <div className='flex justify-end'>
          <div className='gap-2 flex bg-white/40 p-2 rounded-b-xl'>
            <Button
              variant='destructive'
              onClick={() => onDelete(impact.id)}
              disabled={isSaving || isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={isSaving || isDeleting}
              className=''>
              Cancel
            </Button>

            <Button
              variant='default'
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className=''>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
