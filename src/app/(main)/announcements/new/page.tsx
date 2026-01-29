'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { useAnnouncementsStore } from '@/hooks/use-announcements-store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';

const announcementFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters.' })
    .max(100, { message: 'Title must not be longer than 100 characters.' }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters.' })
    .max(2000, {
      message: 'Content must not be longer than 2000 characters.',
    }),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addAnnouncement } = useAnnouncementsStore();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  function onSubmit(data: AnnouncementFormValues) {
    addAnnouncement({
      ...data,
      adminId: 'admin01', // Mock admin ID
    });

    toast({
      title: 'Announcement Created!',
      description: 'The new announcement has been posted.',
    });
    router.push('/announcements');
  }

  return (
    <>
      <PageHeader title="New Announcement" />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create a New Announcement</CardTitle>
            <CardDescription>
              This will be visible to all students and staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Holiday Notice" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the full content of the announcement..."
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/announcements">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? 'Posting...'
                      : 'Post Announcement'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
