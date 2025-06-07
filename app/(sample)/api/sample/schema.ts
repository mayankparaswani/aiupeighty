import { z } from 'zod';

// define a schema for the notifications
export const jobSchema = z.object({
  jobData: z.object({
    titles: z
      .array(z.string())
      .describe('List of alternate titles for the job.'),
    mustHaves: z
      .array(z.string())
      .describe('List of must-have qualifications for the job title.'),
    shouldHaves: z
      .array(z.string())
      .describe('List of should-have qualifications for the job title.'),
    linkedInFilter: z
      .string()
      .describe(
        'LinkedIn boolean search filter for the job with modifiers like AND, OR, NOT, including the job title and must-haves and should-have qualifications.',
      ),
  }),
});
