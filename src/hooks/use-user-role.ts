'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useUserRole() {
  const { user, isUserLoading: isAuthLoading, userError } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isRoleLoading, error: roleError } = useDoc(userDocRef);

  const role = useMemo(() => userData?.role || null, [userData]);
  const isLoading = isAuthLoading || (user && isRoleLoading);
  const error = userError || roleError;

  return { user, role, isLoading, error };
}
