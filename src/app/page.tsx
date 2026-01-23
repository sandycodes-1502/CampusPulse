
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, User, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/app-logo';
import { placeholderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const heroImage = placeholderImages.find((p) => p.id === 'landing-hero');
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/admin-dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
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
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <AppLogo />
        <Button asChild>
          <Link href="/login">
            Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              One Platform for a Smarter Campus.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              CampusPulse is a centralized digital platform designed to simplify
              and modernize hostel and campus operations, bringing everything
              into one smart, unified system.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          {heroImage && (
            <div className="mt-12 md:mt-16 rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto aspect-[16/9] relative">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            </div>
          )}
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">
                A Role-Based Digital System
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tailored experiences for every member of your campus community.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center transition-transform transform hover:-translate-y-2 duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 rounded-full h-16 w-16 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="mt-4 font-headline">
                    Student Portal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Request outpasses, check fee status, submit feedback, and
                    raise complaints with ease.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center transition-transform transform hover:-translate-y-2 duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 rounded-full h-16 w-16 flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="mt-4 font-headline">
                    Security Desk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Verify outpasses in real-time and maintain accurate student
                    entry/exit logs.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center transition-transform transform hover:-translate-y-2 duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/20 rounded-full h-16 w-16 flex items-center justify-center">
                    <UserCog className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="mt-4 font-headline">
                    Admin Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Manage all campus operations, view analytics, and post
                    announcements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CampusPulse. All rights reserved.</p>
      </footer>
    </div>
  );
}
