import { useState } from 'react';
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

  return (
    <div className='space-y-3'>
      <Card className='rounded-xl bg-white/40 p-6 mb-0 rounded-br-none'>
        <div className='grid grid-cols-[1fr_1fr_0.5fr] gap-4'>
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
          <div>
            <Label className='text-sm font-medium'>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter description'
              className='mt-1 bg-white resize-none h-29'
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
              <Label className='text-sm font-medium'>Score</Label>
              <Select
                value={score.toString()}
                onValueChange={(v) =>
                  setScore(parseInt(v) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)
                }>
                <SelectTrigger className='mt-1 bg-white w-full'>
                  <SelectValue placeholder='Select from 1-10' />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons Below Card */}
      <div className='flex justify-end'>
        <div className='gap-2 flex bg-white/40 p-2 rounded-b-xl'>
          <Button
            variant='default'
            onClick={handleSave}
            disabled={isSaving || isDeleting}
            className=''>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant='outline'
            onClick={() => onDelete(impact.id)}
            disabled={isSaving || isDeleting}>
            {isDeleting ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  );
}
