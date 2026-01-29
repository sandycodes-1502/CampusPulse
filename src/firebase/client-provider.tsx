'use client';

import { app, db } from './config';
import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  app: FirebaseApp;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseContext.Provider value={{ app, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const getFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error(
      'getFirebase must be used within a FirebaseClientProvider'
    );
  }
  return context;
};
