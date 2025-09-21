import { useState, useEffect, useCallback } from 'react';
import { Note, StorageData } from '../types';
import { STORAGE_KEYS, STORAGE_VERSION } from '../utils/constants';

export const useLocalStorage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const saveNotes = useCallback((notes: Note[], noteCounter: number = 1): boolean => {
    try {
      const storageData: StorageData = {
        notes,
        noteCounter,
        lastModified: new Date(),
        version: STORAGE_VERSION
      };
      localStorage.setItem(STORAGE_KEYS.LOCAL_STORAGE, JSON.stringify(storageData));
      return true;
    } catch (err) {
      setError('Failed to save notes');
      return false;
    }
  }, []);

  const loadNotes = useCallback((): { notes: Note[]; noteCounter: number } => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE);
      
      if (!stored) {
        setIsLoading(false);
        return { notes: [], noteCounter: 1 };
      }

      const data: StorageData = JSON.parse(stored);

      const notes = data.notes.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));

      setIsLoading(false);
      setError(null);
      return { 
        notes, 
        noteCounter: data.noteCounter || 1
      };
    } catch (err) {
      console.error('Failed to load notes from localStorage:', err);
      setError('Failed to load notes');
      setIsLoading(false);
      return { notes: [], noteCounter: 1 };
    }
  }, []);

  const clearStorage = useCallback((): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.LOCAL_STORAGE);
      setError(null);
    } catch (err) {
      console.error('Failed to clear storage:', err);
      setError('Failed to clear storage');
    }
  }, []);

  const getStorageInfo = useCallback((): { count: number; lastModified: Date | null; size: string } => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE);
      if (!stored) {
        return { count: 0, lastModified: null, size: '0 KB' };
      }

      const data: StorageData = JSON.parse(stored);
      const sizeInBytes = new Blob([stored]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(1);

      return {
        count: data.notes.length,
        lastModified: new Date(data.lastModified),
        size: `${sizeInKB} KB`
      };
    } catch (err) {
      console.error('Failed to get storage info:', err);
      return { count: 0, lastModified: null, size: '0 KB' };
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    saveNotes,
    loadNotes,
    clearStorage,
    getStorageInfo,
    isLoading,
    error
  };
};