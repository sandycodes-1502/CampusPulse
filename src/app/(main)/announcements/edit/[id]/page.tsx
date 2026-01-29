'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
import { Skeleton } from '@/components/ui/skeleton';

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

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const { announcements, updateAnnouncement, isLoading } = useAnnouncementsStore();

  const announcementToEdit = announcements.find((ann) => ann.id === id);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (announcementToEdit) {
      form.reset({
        title: announcementToEdit.title,
        content: announcementToEdit.content,
      });
    }
  }, [announcementToEdit, form]);

  function onSubmit(data: AnnouncementFormValues) {
    if (!announcementToEdit) return;

    updateAnnouncement(announcementToEdit.id, {
      ...announcementToEdit,
      ...data,
      postDate: new Date().toISOString(),
    });

    toast({
      title: 'Announcement Updated!',
      description: 'The announcement has been successfully saved.',
    });
    router.push('/announcements');
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Edit Announcement" />
        <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <div className="flex justify-end gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
        </div>
      </>
    );
  }

  if (!announcementToEdit) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Announcement Not Found</h1>
                <p className="text-muted-foreground">The requested announcement does not exist.</p>
                <Button asChild className="mt-4">
                    <Link href="/announcements">Go Back</Link>
                </Button>
            </div>
        </div>
    );
  }

  return (
    <>
      <PageHeader title="Edit Announcement" />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Edit Announcement Details</CardTitle>
            <CardDescription>
              Make changes to the announcement below.
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
                      ? 'Saving...'
                      : 'Save Changes'}
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
