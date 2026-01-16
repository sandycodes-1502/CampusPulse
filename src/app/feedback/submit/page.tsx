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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFeedbackStore } from '@/hooks/use-feedback-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/app-logo';

const feedbackFormSchema = z.object({
  category: z.enum(['Hostel', 'College'], {
    required_error: 'Please select a category.',
  }),
  feedback: z
    .string()
    .min(10, { message: 'Feedback must be at least 10 characters.' })
    .max(1000, { message: 'Feedback must not be longer than 1000 characters.' }),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function SubmitFeedbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addFeedback } = useFeedbackStore();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedback: '',
    },
  });

  function onSubmit(data: FeedbackFormValues) {
    addFeedback(data);
    toast({
      title: 'Feedback Submitted!',
      description: 'Thank you for your valuable feedback. We will look into it.',
      variant: 'default',
      duration: 5000,
    });
    router.push('/');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <AppLogo />
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Submit Anonymous Feedback</CardTitle>
          <p className="text-muted-foreground">Your voice matters. Help us improve the campus experience. Your submission is completely anonymous.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hostel">Hostel Facilities</SelectItem>
                        <SelectItem value="College">College Facilities</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the area your feedback relates to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you think..."
                        className="resize-y min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please be detailed and constructive.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <Button variant="ghost" asChild>
                    <Link href="/">Cancel</Link>
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
