import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCreateImpact } from '@/api/impacts';
import type { SectionType, Impact } from '@/api/impacts';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  relationType: z.enum(['Direct', 'Indirect', 'Hidden']),
  dimension: z.enum(['Environmental', 'Social', 'Economic']),
  score: z.number().min(1).max(10),
  sdgs: z.string().optional(),
});

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
  backgroundColor = 'bg-[#F5EAFE]', // soft purple like the mock
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      relationType: 'Direct',
      dimension: 'Environmental',
      score: 5,
      sdgs: '',
    },
  });

  const createImpactMutation = useCreateImpact();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!projectId) {
      toast.error('Missing project id');
      return;
    }

    try {
      const impact = await createImpactMutation.mutateAsync({
        projectId: parseInt(projectId),
        title: values.title,
        type: sectionKey,
        relation: values.relationType,
        dimension: values.dimension,
        score: values.score as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
        description: values.description,
      });

      if (impact?.id) {
        toast.success('Impact added');
        onCreated?.(impact);
        form.reset();
      } else {
        console.error('No id in response:', impact);
        toast.error('Failed to add impact');
      }
    } catch (err) {
      console.error('Error creating impact:', err);
      toast.error('Error creating impact');
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl ${backgroundColor}`}>
        <DialogHeader className='mb-4'>
          <DialogTitle className='text-xl font-semibold'>{sectionKey}</DialogTitle>
          <DialogDescription>Add and manage entries for this section.</DialogDescription>
        </DialogHeader>

        <div className='space-y-8'>
          {/* FORM */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'>
              {/* Title + Description */}
              <div className='grid gap-4 md:grid-cols-[2fr,3fr]'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter title'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder='Enter description or notes (optional)'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Impact Type row */}
              <div className='grid gap-4 md:grid-cols-4'>
                <FormField
                  control={form.control}
                  name='relationType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Direct'>Direct</SelectItem>
                          <SelectItem value='Indirect'>Indirect</SelectItem>
                          <SelectItem value='Hidden'>Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dimension'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Environmental'>Environmental</SelectItem>
                          <SelectItem value='Social'>Social</SelectItem>
                          <SelectItem value='Economic'>Economic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='sdgs'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SDGs</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Select SDG'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='score'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact score</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          max={10}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Buttons row (top-right like mockup) */}
              <div className='flex justify-end gap-2 pt-2'>
                <Button
                  variant='outline'
                  type='button'>
                  Save
                </Button>
                <Button
                  variant='outline'
                  type='button'>
                  Remove
                </Button>
                <Button
                  type='submit'
                  disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Adding...' : 'Add Entry'}
                </Button>
              </div>
            </form>
          </Form>

          {/* EXISTING ENTRIES AS BOXES */}
          {existingImpacts.length > 0 && (
            <div className='space-y-3'>
              <h3 className='text-sm font-semibold'>Existing Entries</h3>
              <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {existingImpacts.map((impact) => (
                  <Card
                    key={impact.id}
                    className='relative flex flex-col gap-3 rounded-xl border bg-white/70 p-4 shadow-sm'>
                    <button
                      type='button'
                      className='absolute right-3 top-2 text-lg text-muted-foreground hover:text-foreground'
                      onClick={() => toast.info('Delete functionality coming soon')}>
                      ×
                    </button>

                    <p className='text-sm font-medium'>{impact.title || 'No title'}</p>

                    <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
                      <p>
                        <span className='font-semibold'>Type: </span>
                        {impact.relation}
                      </p>
                      <p>
                        <span className='font-semibold'>Category: </span>
                        {impact.dimension}
                      </p>
                      <p>
                        <span className='font-semibold'>Score: </span>
                        {impact.score}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Bottom buttons like "Cancel / Save All Changes" */}
          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button>Save All Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
