
'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query, orderBy } from 'firebase/firestore';
import type { Outpass } from '@/lib/types';
import { getFirebase } from '@/firebase/client-provider';

export function useOutpassesStore() {
  const { db } = getFirebase();
  const outpassesRef = collection(db, 'outpass-data');
  const q = query(outpassesRef, orderBy('id', 'desc'));

  const [value, isLoading, error] = useCollection(q);

  const outpasses: Outpass[] =
    value?.docs.map((doc) => ({
      docId: doc.id,
      ...(doc.data() as Omit<Outpass, 'docId'>),
    })) || [];

  return { outpasses, isLoading, error };
}
