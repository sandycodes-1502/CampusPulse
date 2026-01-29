'use client';

import { useCollection as useFirestoreCollection } from 'react-firebase-hooks/firestore';
import { collection, query, DocumentData, Query } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';

export function useCollection<T extends DocumentData>(collectionName: string) {
  const { db } = useFirebase();
  const colRef = collection(db, collectionName);
  const q = query(colRef);

  const [snapshot, loading, error] = useFirestoreCollection(q);

  const data = snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as T[] | undefined;

  return { data, loading, error };
}
