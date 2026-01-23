'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const { user } = useUser();

  return (
    <>
      <PageHeader title="Student Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4">
          <h1 className="text-2xl font-bold">Welcome, {user?.displayName || 'Student'}!</h1>
          <p className="text-muted-foreground">
            Here you can manage your outpasses, submit feedback, and check your fee status.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 bg-card border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Outpass</h3>
                <p className="text-muted-foreground mb-4">Request and manage your outpasses.</p>
                <Button asChild>
                    <Link href="/outpass">Go to Outpass <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
            <div className="p-6 bg-card border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                <p className="text-muted-foreground mb-4">Submit anonymous feedback about campus facilities.</p>
                <Button asChild>
                    <Link href="/feedback/submit">Submit Feedback <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
            <div className="p-6 bg-card border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Fee Status</h3>
                <p className="text-muted-foreground mb-4">Check your current hostel fee status.</p>
                <Button asChild>
                    <Link href="/fees">Check Fees <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
        </div>
      </main>
    </>
  );
}
