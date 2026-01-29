'use client';

import { FirebaseProvider } from './provider';
import { db } from './client';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FirebaseProvider value={{ db }}>{children}</FirebaseProvider>;
}
