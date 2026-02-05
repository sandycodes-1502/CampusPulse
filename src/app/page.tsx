'use client';

import Link from 'next/link';
import Image from 'next/image';

import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = placeholderImages.find((img) => img.id === 'landing-hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <AppLogo />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
             <nav className="flex items-center gap-2">
              <Button asChild>
                <Link href="/admin-dashboard">Dashboards</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImage && (
                <Image
                  alt="Hero"
                  className="mx-auto aspect-video w-full overflow-hidden rounded-xl object-cover lg:order-last"
                  height="338"
                  src={heroImage.imageUrl}
                  width="600"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unified Campus Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CampusPulse streamlines everything from hostel management to
                    outpass requests and fee payments.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/admin-dashboard">Explore Dashboards</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center py-6 md:py-8 border-t">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CampusPulse. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
