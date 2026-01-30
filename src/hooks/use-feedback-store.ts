'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Feedback } from '@/lib/types';
import { getFirebase } from '@/firebase/client-provider';

export function useFeedbackStore() {
  const { db } = getFirebase();
  const feedbacksRef = collection(db, 'feedbacks');
  const q = query(feedbacksRef, orderBy('submissionDate', 'desc'));

  const [value, isLoading, error] = useCollection(q);

  const feedback: Feedback[] =
    value?.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Feedback, 'id'>),
    })) || [];

  return { feedback, isLoading, error };
}
