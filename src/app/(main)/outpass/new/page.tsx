
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import { students } from '@/lib/data';
import { useFirebase } from '@/firebase/provider';

const outpassFormSchema = z.object({
  reason: z.string().min(5, { message: 'Reason must be at least 5 characters.' }),
  destination: z.string().min(3, { message: 'Destination is required.' }),
  departureDateTime: z.date({ required_error: 'Departure date is required.' }),
  returnDateTime: z.date({ required_error: 'Return date is required.' }),
}).refine((data) => data.returnDateTime > data.departureDateTime, {
  message: "Return date must be after departure date.",
  path: ["returnDateTime"],
});

type OutpassFormValues = z.infer<typeof outpassFormSchema>;

const mockStudent = students[0]; // Using the first student for demo purposes

export default function NewOutpassPage() {
  const { db } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<OutpassFormValues>({
    resolver: zodResolver(outpassFormSchema),
    defaultValues: {
      reason: '',
      destination: '',
    }
  });

  async function onSubmit(data: OutpassFormValues) {
    try {
      const outpassesCollection = collection(db, 'outpasses');
      await addDoc(outpassesCollection, {
        studentId: mockStudent.id,
        studentName: mockStudent.name,
        roomNumber: 'A-101', // Mock room number
        reason: data.reason,
        destination: data.destination,
        departureDateTime: data.departureDateTime.toISOString(),
        returnDateTime: data.returnDateTime.toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      toast({
        title: 'Outpass Request Submitted',
        description: 'Your request is now pending approval.',
      });
      router.push('/student-dashboard');
    } catch (error) {
      console.error("Failed to submit outpass request:", error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: `There was a problem submitting your request. ${errorMessage}`,
      });
    }
  }

  return (
    <>
      <PageHeader title="Request New Outpass" />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Outpass Request Form</CardTitle>
            <CardDescription>
              Fill out the details below to request permission to leave campus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Pune City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Leave</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Family event, Shopping" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departureDateTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Departure Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0)) 
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="returnDateTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Return Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < (form.getValues("departureDateTime") || new Date())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/outpass">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? 'Submitting...'
                      : 'Submit Request'}
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
