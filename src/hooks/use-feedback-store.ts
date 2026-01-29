"use client";

import { useState, useEffect, useCallback } from 'react';
import { initialFeedback } from '@/lib/data';
import type { Feedback } from '@/lib/types';

const STORAGE_KEY = 'campus-pulse-feedback';

export function useFeedbackStore() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
      } catch (error) {
        console.error('Failed to write to localStorage', error);
      }
    }
  }, [feedback, isLoading]);
  
  const addFeedback = useCallback((newFeedback: Omit<Feedback, 'id' | 'submissionDate'>) => {
    setFeedback(prev => [
      { 
        ...newFeedback,
        id: `fb-${Date.now()}`,
        submissionDate: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  return { feedback, addFeedback, isLoading };
}
