"use client";

import { useCollection } from '@/firebase/firestore/use-collection';
import type { Outpass } from '@/lib/types';
import { useFirebase } from '@/firebase/provider';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export function useOutpassesStore() {
  const { db } = useFirebase();
  const { data: outpasses, loading: isLoading, error } = useCollection<Outpass>('outpasses');

  const addOutpass = async (newOutpass: Omit<Outpass, 'id' | 'createdAt'>) => {
    const outpassesCollection = collection(db, 'outpasses');
    await addDoc(outpassesCollection, {
      ...newOutpass,
      createdAt: serverTimestamp(),
    });
  };

  const updateOutpass = async (id: string, updatedData: Partial<Omit<Outpass, 'id'>>) => {
    const outpassDoc = doc(db, 'outpasses', id);
    await updateDoc(outpassDoc, updatedData);
  };

  return { outpasses: outpasses || [], addOutpass, updateOutpass, isLoading, error };
}
