'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';


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
import { getFirebase } from '@/firebase/client-provider';


const outpassFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  reason: z.string().min(5, { message: 'Reason must be at least 5 characters.' }),
  startdate: z.date({ required_error: 'Departure date is required.' }),
  enddate: z.date({ required_error: 'Return date is required.' }),
}).refine((data) => data.enddate > data.startdate, {
  message: "Return date must be after departure date.",
  path: ["enddate"],
});

type OutpassFormValues = z.infer<typeof outpassFormSchema>;

export default function NewOutpassPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { db } = getFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OutpassFormValues>({
    resolver: zodResolver(outpassFormSchema),
    defaultValues: {
      name: '',
      reason: '',
    }
  });

  async function onSubmit(data: OutpassFormValues) {
    setIsSubmitting(true);
    try {
      const outpassesRef = collection(db, 'outpass-data');
      
      const q = query(outpassesRef, orderBy('id', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      const newId = querySnapshot.empty ? 1111 : querySnapshot.docs[0].data().id + 1;

      await addDoc(outpassesRef, {
          id: newId,
          name: data.name,
          reason: data.reason,
          duration: {
              startdate: Timestamp.fromDate(data.startdate),
              enddate: Timestamp.fromDate(data.enddate),
          },
          status: 'pending',
      });

      toast({
          title: 'Outpass Request Submitted',
          description: 'Your request is now pending approval.',
      });
      router.push('/student-dashboard');
    } catch (error) {
        console.error("Failed to submit outpass:", error);
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: 'There was a problem with your request.',
        });
    } finally {
        setIsSubmitting(false);
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., John Doe" {...field} />
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
                    name="startdate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>From Date</FormLabel>
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
                    name="enddate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>To Date</FormLabel>
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
                                date < (form.getValues("startdate") || new Date())
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
                    <Link href="/student-dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
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
