"use client";

import { useState, useEffect, useCallback } from 'react';
import { initialFeedback } from '@/lib/data';
import type { Feedback } from '@/lib/types';

const STORAGE_KEY = 'campus-pulse-feedback';

export function useFeedbackStore() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedFeedback = window.localStorage.getItem(STORAGE_KEY);
      if (storedFeedback) {
        setFeedback(JSON.parse(storedFeedback));
      } else {
        setFeedback(initialFeedback);
      }
    } catch (error) {
      console.error('Failed to read from localStorage', error);
      setFeedback(initialFeedback);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
      } catch (error) {
        console.error('Failed to write to localStorage', error);
      }
    }
  }, [feedback, isInitialized]);
  
  const addFeedback = useCallback((newFeedback: Omit<Feedback, 'id' | 'date'>) => {
    setFeedback(prev => [
      ...prev,
      { 
        ...newFeedback,
        id: `F${prev.length + 1}`,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
  }, []);

  return { feedback, addFeedback, isInitialized };
}
