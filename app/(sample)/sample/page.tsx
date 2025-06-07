'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  jobTitle: z.string().min(5, {
    message: 'Job title must be at least 5 characters.',
  }),
});

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { jobSchema } from '../api/sample/schema';

export default function Page() {
  const { object, submit, isLoading } = useObject({
    api: '/api/sample',
    schema: jobSchema,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: 'Fronetend Developer with React and TypeScript Experience',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submit(values.jobTitle);
  }

  return (
    <div className="m-4 max-w-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>
                  Enter a job title eg. Fronetend Developer with React and
                  TypeScript Experience.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
      {isLoading && (
        <div className="mt-4 text-gray-500">Generating job data...</div>
      )}
      {object?.jobData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Job Data</h2>
          <h4>Alternate Titles</h4>
          <Card className={`flex flex-row flex-wrap gap-2 p-2`}>
            {object?.jobData?.titles?.map((title) => (
              <Badge key={`${title}`}>{title}</Badge>
            ))}
          </Card>
          <h4 className="mt-4">Must Haves</h4>
          <Card className={`flex flex-row flex-wrap gap-2 p-2`}>
            {object?.jobData?.mustHaves?.map((item) => (
              <Badge key={`${item}`}>{item}</Badge>
            ))}
          </Card>
          <h4 className="mt-4">Should Haves</h4>
          <Card className={`flex flex-row flex-wrap gap-2 p-2`}>
            {object?.jobData?.shouldHaves?.map((item) => (
              <Badge key={`${item}`}>{item}</Badge>
            ))}
          </Card>
          <h4 className="mt-4">LinkedIn Filter</h4>
          <Card className="p-4">
            <p>{object?.jobData?.linkedInFilter}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
