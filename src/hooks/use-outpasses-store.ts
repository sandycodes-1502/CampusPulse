
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Outpass } from '@/lib/types';
import { initialOutpasses } from '@/lib/data';

const STORAGE_KEY = 'campus-pulse-outpasses';

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
  
  const addOutpass = useCallback((newOutpass: Omit<Outpass, 'id' | 'status'>) => {
    setOutpasses(prev => [
      { 
        ...newOutpass,
        id: `outpass-${Date.now()}`,
        status: 'pending',
      },
      ...prev,
    ]);
  }, []);

  const updateOutpass = useCallback((id: string, updatedData: Partial<Omit<Outpass, 'id'>>) => {
    setOutpasses(prev => prev.map(op => op.id === id ? { ...op, ...updatedData } : op));
  }, []);

  return { outpasses, addOutpass, updateOutpass, isLoading, error: null };
}
