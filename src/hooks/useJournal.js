import { useEffect, useCallback } from 'react';
import { useAppContext } from '../store/AppContext';
import { 
  saveJournalEntry, 
  getJournalEntry, 
  getAllJournalEntries, 
  deleteJournalEntry 
} from '../services/database';

export const useJournal = () => {
  const { 
    state, 
    setJournalLoading, 
    setJournalEntries, 
    setCurrentJournalEntry, 
    addJournalEntry, 
    updateJournalEntry, 
    setError 
  } = useAppContext();

  const loadAllEntries = useCallback(async () => {
    try {
      setJournalLoading(true);
      const entries = await getAllJournalEntries();
      setJournalEntries(entries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      setError('Failed to load journal entries');
    } finally {
      setJournalLoading(false);
    }
  }, [setJournalLoading, setJournalEntries, setError]);

  const loadEntryForDate = useCallback(async (date) => {
    try {
      setJournalLoading(true);
      const entry = await getJournalEntry(date);
      setCurrentJournalEntry(entry);
      return entry;
    } catch (error) {
      console.error('Error loading journal entry:', error);
      setError('Failed to load journal entry');
      return null;
    } finally {
      setJournalLoading(false);
    }
  }, [setJournalLoading, setCurrentJournalEntry, setError]);

  // Load all journal entries on mount
  useEffect(() => {
    loadAllEntries();
  }, [loadAllEntries]);

  const saveEntry = useCallback(async (date, content) => {
    try {
      setJournalLoading(true);
      await saveJournalEntry(date, content);
      
      const newEntry = { date, content, updated_at: new Date().toISOString() };
      
      // Check if entry exists to determine if we should add or update
      const existingEntry = state.journalEntries.find(entry => entry.date === date);
      if (existingEntry) {
        updateJournalEntry(newEntry);
      } else {
        addJournalEntry(newEntry);
      }
      
      // Not updating currentJournalEntry here to avoid conflicts
      // setCurrentJournalEntry(newEntry);
      return newEntry;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setError('Failed to save journal entry');
      return null;
    } finally {
      setJournalLoading(false);
    }
  }, [setJournalLoading, state.journalEntries, updateJournalEntry, addJournalEntry, setError]);

  const deleteEntry = async (date) => {
    try {
      setJournalLoading(true);
      await deleteJournalEntry(date);
      
      // Remove from state
      const updatedEntries = state.journalEntries.filter(entry => entry.date !== date);
      setJournalEntries(updatedEntries);
      
      // Clear current entry if it is the one being deleted
      if (state.currentJournalEntry?.date === date) {
        setCurrentJournalEntry(null);
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      setError('Failed to delete journal entry');
    } finally {
      setJournalLoading(false);
    }
  };

  return {
    journalEntries: state.journalEntries,
    currentJournalEntry: state.currentJournalEntry,
    isLoading: state.isLoadingJournal,
    error: state.error,
    loadEntryForDate,
    saveEntry,
    deleteEntry,
    refreshEntries: loadAllEntries,
  };
};
