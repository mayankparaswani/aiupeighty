import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { formSchema, jobSchema } from './schema';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const rawContext = await req.json();
  // Validate the context with formSchema
  // If you want to validate the context, you can use formSchema here
  const context = formSchema.safeParse(rawContext);
  // If the context is not valid, you can return an error response
  if (!context.success) {
    return new Response(JSON.stringify(context.error), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { jobTitle, companyName, jobDescription } = context.data;
  console.log({ context });
  const prompt = `Generate components for the role of ${jobTitle} at ${companyName} with the following job description: ${jobDescription}. The components should include a list of alternate titles for the job, a list of non-negotiable must-have requirements, a list of nice-to-have preferred or bonus qualities for the job title and a LinkedIn Boolean search string to efficiently source candidates for the job title and description. The boolean search string should be optimized for LinkedIn and include relevant minimal keywords that would help in finding suitable candidates. The response should be structured according to the provided schema.`;
  const result = await generateObject({
    model: google('gemini-1.5-flash'),
    schema: jobSchema,
    prompt,
  });

  return result.toJsonResponse();
}
