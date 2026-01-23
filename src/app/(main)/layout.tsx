'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRole } from '@/hooks/use-user-role';

const adminRoutes = [
  '/admin-dashboard',
  '/rooms',
  '/outpass',
  '/fees',
  '/security',
  '/complaints',
  '/feedback',
  '/announcements',
];
const studentRoutes = [
  '/student-dashboard',
  '/outpass',
  '/fees',
  '/complaints',
  '/feedback/submit',
];
const securityRoutes = ['/security-dashboard', '/security'];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, isLoading } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      return; // Wait until user and role are loaded
    }

    if (!user) {
      router.replace('/'); // Redirect unauthenticated users to the public landing page
      return;
    }
    
    // If user is authenticated but role is not yet determined, wait.
    if (!role) {
        return;
    }

    const roleDashboard = `/${role}-dashboard`;
    let allowedRoutes: string[] = [];

    if (role === 'admin') {
      allowedRoutes = adminRoutes;
    } else if (role === 'student') {
      allowedRoutes = studentRoutes;
    } else if (role === 'security') {
      allowedRoutes = securityRoutes;
    }

    const isAuthorized = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAuthorized) {
      router.replace(roleDashboard);
    }
  }, [user, role, isLoading, router, pathname]);

  if (isLoading || !user || !role) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <MainNav />
      <SidebarInset>
        <main className="flex-1 flex flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
