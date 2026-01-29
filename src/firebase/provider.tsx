'use client';

import { createContext, useContext } from 'react';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const FirebaseProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: FirebaseContextValue;
}) => {
  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
