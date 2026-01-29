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
import { useComplaintsStore } from '@/hooks/use-complaints-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';

const complaintFormSchema = z.object({
  roomNumber: z.string().min(1, { message: 'Room number is required.' }),
  complaintText: z
    .string()
    .min(10, { message: 'Complaint must be at least 10 characters.' })
    .max(1000, {
      message: 'Complaint must not be longer than 1000 characters.',
    }),
});

type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

export default function SubmitComplaintPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addComplaint } = useComplaintsStore();

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      complaintText: '',
    },
  });

  function onSubmit(data: ComplaintFormValues) {
    addComplaint({
      studentId: 'student01', // Mock student ID
      studentName: 'Jane Doe', // Mock student name
      roomNumber: data.roomNumber,
      complaintText: data.complaintText,
      status: 'open',
    });

    toast({
      title: 'Complaint Submitted!',
      description:
        'Thank you for your submission. We will look into it shortly.',
    });
    router.push('/student-dashboard');
  }

  return (
    <>
      <PageHeader title="Submit Complaint" />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              Submit a Complaint
            </CardTitle>
            <p className="text-muted-foreground">
              Report any issues with hostel facilities.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your room number" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A-101">A-101</SelectItem>
                                <SelectItem value="A-102">A-102</SelectItem>
                                <SelectItem value="B-205">B-205</SelectItem>
                                <SelectItem value="C-301">C-301</SelectItem>
                            </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Select the room where the issue is located.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complaintText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the issue in detail..."
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please be as specific as possible.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/student-dashboard">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? 'Submitting...'
                      : 'Submit Complaint'}
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
