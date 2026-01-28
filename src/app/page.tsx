'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/app-logo';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      <header className="absolute top-0 left-0 w-full p-6">
        <AppLogo />
      </header>
      <main>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Dashboard Navigation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild size="lg">
              <Link href="/admin-dashboard">
                Admin Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/student-dashboard">
                Student Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/security-dashboard">
                Security Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <footer className="absolute bottom-0 w-full p-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CampusPulse. All rights reserved.</p>
      </footer>
    </div>
  );
}
