import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import type { SDGId } from '@/api/impacts';
import { sdgReference } from '@/lib/analysis-constants';

const SDG_OPTIONS = sdgReference.map((sdg) => ({
  value: sdg.id as SDGId,
  label: sdg.fullName,
}));

type SDGMultiSelectProps = {
  value: SDGId[];
  onChange: (value: SDGId[]) => void;
  label?: string;
};

export default function SDGMultiSelect({ value, onChange, label = 'SDGs' }: SDGMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleSDG = (sdgId: SDGId) => {
    if (value.includes(sdgId)) {
      onChange(value.filter((id) => id !== sdgId));
    } else {
      onChange([...value, sdgId]);
    }
  };

  const removeSDG = (sdgId: SDGId, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== sdgId));
  };

  return (
    <div>
      <Label className='text-sm font-medium '>{label}</Label>
      <Popover
        open={open}
        onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='mt-1 w-full justify-between bg-white font-normal h-auto min-h-10'>
            <div className='flex flex-wrap gap-1 overflow-hidden'>
              {value.length === 0 ? (
                <span className='text-muted-foreground'>Select SDGs...</span>
              ) : value.length < 2 ? (
                value.map((id) => (
                  <Badge
                    key={id}
                    variant='secondary'
                    className='text-xs'>
                    SDG {id}
                    <X
                      className='ml-1 h-3 w-3 cursor-pointer hover:text-destructive'
                      onClick={(e) => removeSDG(id, e)}
                    />
                  </Badge>
                ))
              ) : (
                <span className='text-sm'>{value.length} SDGs selected</span>
              )}
            </div>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-[--radix-popover-trigger-width] p-0'
          align='start'
          onWheel={(e) => e.stopPropagation()}>
          <Command>
            <CommandInput placeholder='Search SDGs...' />
            <CommandList>
              <CommandEmpty>No SDG found.</CommandEmpty>
              <CommandGroup>
                {SDG_OPTIONS.map((sdg) => {
                  const isSelected = value.includes(sdg.value);
                  return (
                    <CommandItem
                      key={sdg.value}
                      value={`${sdg.value} ${sdg.label}`}
                      onSelect={() => toggleSDG(sdg.value)}>
                      <div
                        className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-input'
                        }`}>
                        {isSelected && <Check className='h-3 w-3' />}
                      </div>
                      <span>SDG {sdg.value}</span>
                      <span className='ml-2 text-muted-foreground'>- {sdg.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
