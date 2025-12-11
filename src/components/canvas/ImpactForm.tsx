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
import SDGMultiSelect from './SDGMultiSelect';
import type { SDGId } from '@/api/impacts';

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
  return (
    <Card className='rounded-xl bg-white/40 p-6 mb-0 rounded-br-none'>
      <div className='grid grid-cols-[1fr_1fr_0.5fr] gap-4'>
        {/* First Column */}
        <div className='space-y-4'>
          {/* Title */}
          <div>
            <Label className='text-sm font-medium'>Title</Label>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
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
        <div>
          <Label className='text-sm font-medium'>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder='Enter description'
            className='mt-1 bg-white resize-none h-29'
          />
        </div>

        {/* Third Column */}
        <div className='space-y-4'>
          {/* SDGs */}
          <SDGMultiSelect
            value={sdgs}
            onChange={onSdgsChange}
          />

          {/* Impact Score */}
          <div>
            <Label className='text-sm font-medium'>Score</Label>
            <Select
              value={score}
              onValueChange={onScoreChange}>
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
  );
}
