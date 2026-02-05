
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Outpass } from '@/lib/types';
import { initialOutpasses } from '@/lib/data';

const STORAGE_KEY = 'campus-pulse-outpasses';

type NewOutpass = Omit<Outpass, 'docId' | 'id'>;

export function useOutpassesStore() {
  const [outpasses, setOutpasses] = useState<Outpass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setOutpasses(JSON.parse(stored));
      } else {
        setOutpasses(initialOutpasses);
      }
    } catch (error) {
      console.error('Failed to read outpasses from localStorage', error);
      setOutpasses(initialOutpasses);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(outpasses));
      } catch (error) {
        console.error('Failed to write outpasses to localStorage', error);
      }
    }
  }, [outpasses, isLoading]);
  
  const addOutpass = useCallback((newOutpass: NewOutpass) => {
    setOutpasses(prev => {
        const latestId = prev.reduce((maxId, op) => Math.max(op.id, maxId), 1110);
        const newEntry: Outpass = {
            ...newOutpass,
            docId: `op-${Date.now()}`,
            id: latestId + 1,
        };
        return [newEntry, ...prev];
    });
  }, []);

  const updateOutpass = useCallback((docId: string, updatedData: Partial<Omit<Outpass, 'docId' | 'id'>>) => {
    setOutpasses(prev => prev.map(op => op.docId === docId ? { ...op, ...updatedData } : op));
  }, []);

  return { outpasses, addOutpass, updateOutpass, isLoading };
}
