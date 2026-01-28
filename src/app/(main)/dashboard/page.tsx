'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin-dashboard');
  }, [router]);

  return (
    <>
    <PageHeader title="Loading Dashboard..." />
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[125px] rounded-lg" />
            <Skeleton className="h-[125px] rounded-lg" />
            <Skeleton className="h-[125px] rounded-lg" />
            <Skeleton className="h-[125px] rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="lg:col-span-4 h-[430px] rounded-lg" />
            <Skeleton className="lg:col-span-3 h-[430px] rounded-lg" />
        </div>
        <Skeleton className="h-[300px] rounded-lg" />
    </div>
    </>
  );
}
