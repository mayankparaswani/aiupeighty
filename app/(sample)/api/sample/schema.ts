import { z } from 'zod';

export const formSchema = z.object({
  jobTitle: z.string().min(5, {
    message: 'Job title must be at least 5 characters.',
  }),
  companyName: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  jobDescription: z.string().min(10, {
    message: 'Job description must be at least 10 characters.',
  }),
});

// define a schema for the notifications
export const jobSchema = z.object({
  titles: z.array(z.string()).describe('List of alternate titles for the job.'),
  mustHaves: z
    .array(z.string())
    .describe(
      'List of non-negotiable must-have requirements for the job title.',
    ),
  shouldHaves: z
    .array(z.string())
    .describe(
      'List of nice to have preferred or bonus qualities for the job title.',
    ),
});

export const pJobSchema = jobSchema
  .partial({
    titles: true,
    mustHaves: true,
    shouldHaves: true,
  })
  .optional();

export type JobSchema = z.infer<typeof pJobSchema>;
