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

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { type JobSchema, jobSchema } from '../api/sample/schema';
import { Combobox } from '@/components/comboBox';
import { useEffect, useMemo } from 'react';
import { CopyButton } from '@/components/copy-button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

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
      {object && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Job Data</h2>
          <p className="text-muted-foreground text-sm">
            The fields are automatically populated by the AI and are editable.
            Change the tags to generate the required filter for LinkedIN.
          </p>
          <JobOutput jobData={object as JobSchema} />
        </div>
      )}
    </div>
  );
}

function JobOutput({ jobData }: { jobData: JobSchema }) {
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
  });
  useEffect(() => {
    if (jobData) {
      form.reset(jobData);
    }
  }, [jobData, form]);
  function onSubmit(values: z.infer<typeof jobSchema>) {
    // Handle form submission logic here
    console.log('Form submitted with values:', values);
  }
  const generateLinkedInFilter = (data: JobSchema) => {
    if (!data || !data.titles || !data.mustHaves || !data.shouldHaves) {
      return '';
    }
    const titles = data.titles?.map((t) => `"${t}"`).join(' OR ');
    const mustHaves = data.mustHaves.map((item) => `"${item}"`).join(' AND ');
    const shouldHaves = data.shouldHaves
      .map((item) => `"${item}"`)
      .join(' OR ');
    return `(${titles}) AND (${mustHaves}) AND (${shouldHaves})`;
  };

  const formValues = form.watch();
  const linkedInFilter = useMemo(() => {
    return generateLinkedInFilter(formValues);
  }, [formValues]); // Memoize the generated filter string

  return (
    <div className="m-4 max-w-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="titles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternate Titles</FormLabel>
                <FormControl>
                  <Combobox
                    multiple
                    allowCreate
                    options={jobData?.titles}
                    placeholder="Select or create alternate titles"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mustHaves"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Must Haves</FormLabel>
                <FormControl>
                  <Combobox
                    multiple
                    allowCreate
                    options={jobData?.mustHaves}
                    placeholder="Select or create must haves"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shouldHaves"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Should Haves</FormLabel>
                <FormControl>
                  <Combobox
                    multiple
                    allowCreate
                    options={jobData?.shouldHaves}
                    placeholder="Select or create should haves"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="grid gap-2 my-8">
        <div className="flex items-center gap-2 text-sm leading-none font-medium select-none">
          LinkedIn Filter
        </div>
        <Card className="p-4 bg-muted-50 text-sm font-mono font-medium relative">
          {linkedInFilter}
          <CopyButton
            value={linkedInFilter}
            className="absolute right-2 bottom-2"
            variant="outline"
          />
        </Card>
      </div>
      <Link
        href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
          linkedInFilter,
        )}`}
        target="_blank"
      >
        <Button>Open in LinkedIn</Button>
      </Link>
    </div>
  );
}
