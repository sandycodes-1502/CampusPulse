"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Announcement } from '@/lib/types';
import { initialAnnouncements } from '@/lib/data';

const STORAGE_KEY = 'campus-pulse-announcements';

export function useAnnouncementsStore() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAnnouncements(JSON.parse(stored));
      } else {
        setAnnouncements(initialAnnouncements);
      }
    } catch (error) {
      console.error('Failed to read announcements from localStorage', error);
      setAnnouncements(initialAnnouncements);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
      } catch (error) {
        console.error('Failed to write announcements to localStorage', error);
      }
    }
  }, [announcements, isLoading]);
  
  const addAnnouncement = useCallback((newAnnouncement: Omit<Announcement, 'id' | 'postDate'>) => {
    setAnnouncements(prev => [
      { 
        ...newAnnouncement,
        id: `ann-${Date.now()}`,
        postDate: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const updateAnnouncement = useCallback((id: string, updatedData: Partial<Omit<Announcement, 'id'>>) => {
    setAnnouncements(prev => prev.map(ann => ann.id === id ? { ...ann, ...updatedData } : ann));
  }, []);

  const removeAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  }, []);

  return { announcements, addAnnouncement, updateAnnouncement, removeAnnouncement, isLoading };
}
