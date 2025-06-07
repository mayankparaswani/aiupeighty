import { z } from 'zod';

// define a schema for the notifications
export const jobSchema = z.object({
  titles: z.array(z.string()).describe('List of alternate titles for the job.'),
  mustHaves: z
    .array(z.string())
    .describe('List of must-have qualifications for the job title.'),
  shouldHaves: z
    .array(z.string())
    .describe('List of should-have qualifications for the job title.'),
});

export const pJobSchema = jobSchema
  .partial({
    titles: true,
    mustHaves: true,
    shouldHaves: true,
  })
  .optional();

export type JobSchema = z.infer<typeof pJobSchema>;
