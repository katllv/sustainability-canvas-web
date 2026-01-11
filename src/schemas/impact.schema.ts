import { z } from 'zod';

export const impactFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 100 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  relationType: z.enum(['Direct', 'Indirect', 'Hidden'], 'Please select an impact type'),
  dimension: z.enum(['Environmental', 'Social', 'Economic'], 'Please select a dimension'),
  sdgs: z.array(z.number().int().min(1).max(17)).max(17, 'Cannot select more than 17 SDGs'),
  score: z.enum(['1', '2', '3', '4', '5'], 'Please select a score'),
});

export type ImpactFormData = z.infer<typeof impactFormSchema>;
