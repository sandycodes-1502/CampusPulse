'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserRole } from '@/hooks/use-user-role';

const studentRoutes = ['/student-dashboard', '/outpass', '/feedback', '/fees', '/complaints'];
const securityRoutes = ['/security-dashboard', '/security'];
// Admin can access all routes, so no need for a specific list

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
      router.push('/login');
      return;
    }

    if (role) {
      const roleDashboard = `/${role}-dashboard`;

      let isAuthorized = false;
      if (role === 'admin') {
        isAuthorized = true; // Admins can access everything
      } else if (role === 'student') {
        isAuthorized = studentRoutes.some((route) => pathname.startsWith(route));
      } else if (role === 'security') {
        isAuthorized = securityRoutes.some((route) => pathname.startsWith(route));
      }

      if (!isAuthorized) {
        router.replace(roleDashboard);
      } else if (pathname === '/admin-dashboard' || pathname === '/student-dashboard' || pathname === '/security-dashboard') {
        if (pathname !== roleDashboard) {
            router.replace(roleDashboard);
        }
      }
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
