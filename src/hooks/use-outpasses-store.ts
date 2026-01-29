
"use client";

import { useCollection } from 'react-firebase-hooks/firestore';
import type { Outpass } from '@/lib/types';
import { useFirebase } from '@/firebase/provider';
import { doc, updateDoc, collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';

export function useOutpassesStore() {
  const { db } = useFirebase();
  const outpassesCollection = collection(db, 'outpasses');
  // Order by creation date, newest first
  const q = query(outpassesCollection, orderBy('createdAt', 'desc'));

  const [snapshot, isLoading, error] = useCollection(q);

  const outpasses = useMemo(() => 
    snapshot?.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Outpass[] | undefined,
  [snapshot]);

  const updateOutpass = async (id: string, updatedData: Partial<Omit<Outpass, 'id'>>) => {
    if (!db) return;
    const outpassDoc = doc(db, 'outpasses', id);
    try {
      await updateDoc(outpassDoc, updatedData);
      console.log('Successfully updated outpass:', id, 'with data:', updatedData);
    } catch (e) {
      console.error('Error updating outpass:', e);
      // In a real app, you might want to show a toast notification for the error
    }
  };

  return { outpasses: outpasses || [], updateOutpass, isLoading, error };
}
