import { Card } from '@/components/ui/card';
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
import type { SDGId } from '@/api/impacts';
import { impactFormSchema } from '@/schemas';
import { FieldError } from '@/components/ui/field';
import { useMemo, useState } from 'react';
import { z } from 'zod';

type ImpactFormProps = {
  title: string;
  description: string;
  relationType: string;
  dimension: string;
  sdgs: SDGId[];
  score: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onRelationTypeChange: (value: string) => void;
  onDimensionChange: (value: string) => void;
  onSdgsChange: (value: SDGId[]) => void;
  onScoreChange: (value: string) => void;
};

export default function ImpactForm({
  title,
  description,
  relationType,
  dimension,
  sdgs,
  score,
  onTitleChange,
  onDescriptionChange,
  onRelationTypeChange,
  onDimensionChange,
  onSdgsChange,
  onScoreChange,
}: ImpactFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate current form values
  const validationErrors = useMemo(() => {
    const result = impactFormSchema.safeParse({
      title,
      description,
      relationType,
      dimension,
      sdgs,
      score,
    });
    return result.error ? z.flattenError(result.error).fieldErrors : {};
  }, [title, description, relationType, dimension, sdgs, score]);

  return (
    <Card className='rounded-xl bg-white/40 p-6 mb-0 rounded-br-none'>
      <div className='grid grid-cols-[1fr_1fr_0.6fr] gap-4'>
        {/* First Column */}
        <div className='space-y-4'>
          {/* Title */}
          <div>
            <Label className='text-sm font-medium'>Title</Label>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
              placeholder='Enter title'
              className='mt-1 bg-white'
            />
            {touched.title && validationErrors.title && (
              <FieldError className='mt-1'>{validationErrors.title[0]}</FieldError>
            )}
          </div>

          {/* Impact Type and Dimension */}
          <div className='grid grid-cols-[1fr_2fr] gap-4'>
            <div>
              <Label className='text-sm font-medium'>Type</Label>
              <Select
                value={relationType}
                onValueChange={onRelationTypeChange}>
                <SelectTrigger className='mt-1 bg-white w-full'>
                  <SelectValue placeholder='Select' />
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
                onValueChange={onDimensionChange}>
                <SelectTrigger className='mt-1 bg-white w-full'>
                  <SelectValue placeholder='Select' />
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
            onChange={(e) => onDescriptionChange(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
            placeholder='Enter description'
            className='mt-1 bg-white resize-none h-29 w-full break-words'
          />
          {touched.description && validationErrors.description && (
            <FieldError className='mt-1'>{validationErrors.description[0]}</FieldError>
          )}
        </div>

        {/* Third Column */}
        <div className='space-y-4'>
          {/* SDGs */}
          <div>
            <SDGMultiSelect
              value={sdgs}
              onChange={(value) => {
                setTouched((prev) => ({ ...prev, sdgs: true }));
                onSdgsChange(value);
              }}
            />
            {touched.sdgs && validationErrors.sdgs && (
              <FieldError className='mt-1'>{validationErrors.sdgs[0]}</FieldError>
            )}
          </div>

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
              value={score}
              onValueChange={(value) => {
                setTouched((prev) => ({ ...prev, score: true }));
                onScoreChange(value);
              }}
              onOpenChange={(open) => {
                if (!open) {
                  setTouched((prev) => ({ ...prev, score: true }));
                }
              }}>
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
            {touched.score && validationErrors.score && (
              <FieldError className='mt-1'>{validationErrors.score[0]}</FieldError>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
