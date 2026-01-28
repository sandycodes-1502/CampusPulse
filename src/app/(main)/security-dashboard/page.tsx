'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SecurityDashboardPage() {
  return (
    <>
      <PageHeader title="Security Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4">
          <h1 className="text-2xl font-bold">Welcome, Security Staff!</h1>
          <p className="text-muted-foreground">
            Here you can manage student entry/exit and verify outpasses.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-card border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Entry/Exit Logging</h3>
                <p className="text-muted-foreground mb-4">Log student entries and exits and view daily logs.</p>
                <Button asChild>
                    <Link href="/security">Go to Security Desk <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
            <div className="p-6 bg-card border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Verify Outpass</h3>
                <p className="text-muted-foreground mb-4">Verify student outpass QR codes or IDs.</p>
                <Button asChild>
                    <Link href="/security">Go to Security Desk <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
        </div>
      </main>
    </>
  );
}
