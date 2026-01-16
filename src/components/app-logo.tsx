import { Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLogo({ className, textClassName }: { className?: string, textClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary rounded-md p-1.5">
        <Waves className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className={cn("text-xl font-bold font-headline text-foreground", textClassName)}>CampusPulse</span>
    </div>
  );
}
