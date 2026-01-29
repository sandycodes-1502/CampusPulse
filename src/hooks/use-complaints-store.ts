"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Complaint } from '@/lib/types';
import { initialComplaints } from '@/lib/data';

const STORAGE_KEY = 'campus-pulse-complaints';

export function useComplaintsStore() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setComplaints(JSON.parse(stored));
      } else {
        setComplaints(initialComplaints);
      }
    } catch (error) {
      console.error('Failed to read complaints from localStorage', error);
      setComplaints(initialComplaints);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
      } catch (error) {
        console.error('Failed to write complaints to localStorage', error);
      }
    }
  }, [complaints, isLoading]);
  
  const addComplaint = useCallback((newComplaint: Omit<Complaint, 'id' | 'submissionDate'>) => {
    setComplaints(prev => [
      { 
        ...newComplaint,
        id: `comp-${Date.now()}`,
        submissionDate: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const updateComplaint = useCallback((id: string, updatedData: Partial<Omit<Complaint, 'id'>>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  }, []);

  return { complaints, addComplaint, updateComplaint, isLoading };
}
