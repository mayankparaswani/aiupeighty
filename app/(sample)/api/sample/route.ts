import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { jobSchema } from './schema';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = await generateObject({
    model: google('gemini-1.5-flash'),
    schema: jobSchema,
    prompt: `Generate 3 notifications for a messages app in this context:${context}`,
  });

  return result.toJsonResponse();
}
