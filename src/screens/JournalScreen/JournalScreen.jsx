import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import styles from './styles';
import { useAppContext } from '../../store/AppContext';
import { useJournal } from '../../hooks/useJournal';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

const getTodayDisplayString = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const JournalScreen = ({ navigation, route }) => {
  const { state } = useAppContext();
  const { currentJournalEntry, isLoading, saveEntry, loadEntryForDate } = useJournal();
  
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef(null);
  
  // Use selected date from navigation params or default to today
  const selectedDate = route?.params?.selectedDate || getTodayString();
  const selectedEntry = route?.params?.entry || null;

  useEffect(() => {
    // Load selected date's journal entry when component mounts
    if (selectedEntry) {
      // If entry is passed via navigation, use it directly
      setJournalText(selectedEntry.content);
      setHasUnsavedChanges(false);
    } else {
      // Otherwise load from database
      loadEntryForDate(selectedDate);
    }
  }, [selectedDate, selectedEntry, loadEntryForDate]);

  useEffect(() => {
    // Update text input when journal entry is loaded
    if (currentJournalEntry && currentJournalEntry.date === selectedDate) {
      setJournalText(currentJournalEntry.content);
      setHasUnsavedChanges(false);
    } else if (!selectedEntry) {
      setJournalText('');
      setHasUnsavedChanges(false);
    }
  }, [currentJournalEntry, selectedDate, selectedEntry]);

  const handleTextChange = (text) => {
    setJournalText(text);
    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new auto-save timeout (save after 2 seconds of inactivity)
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave(text);
    }, 2000);
  };

  const handleAutoSave = async (text) => {
    if (text.trim() === '') return;

    try {
      setIsSaving(true);
      await saveEntry(selectedDate, text);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (journalText.trim() === '') {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    try {
      setIsSaving(true);
      await saveEntry(selectedDate, journalText);
      setHasUnsavedChanges(false);
      Alert.alert('Saved', 'Your journal entry has been saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges && journalText.trim() !== '') {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before leaving?',
        [
          { text: 'Don\'t Save', onPress: () => navigation.goBack() },
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: handleManualSave },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading && !currentJournalEntry) {
    return <LoadingSpinner message="Loading your journal..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Journal Entry</Text>
          <Text style={styles.date}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.zodiacSign}>Zodiac: {state.selectedZodiacSign}</Text>
        </View>
        <View style={styles.headerRight}>
          {isSaving && <Text style={styles.savingText}>Saving...</Text>}
          {hasUnsavedChanges && !isSaving && (
            <Text style={styles.unsavedText}>Unsaved</Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>How was your day? Write your thoughts...</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Start writing your journal entry here..."
            placeholderTextColor="#9ca3af"
            value={journalText}
            onChangeText={handleTextChange}
            textAlignVertical="top"
            autoFocus={!currentJournalEntry}
          />
        </View>

        {currentJournalEntry && (
          <View style={styles.entryInfo}>
            <Text style={styles.entryInfoText}>
              Created: {new Date(currentJournalEntry.created_at || currentJournalEntry.date).toLocaleString()}
            </Text>
            {currentJournalEntry.updated_at && currentJournalEntry.updated_at !== currentJournalEntry.created_at && (
              <Text style={styles.entryInfoText}>
                Last updated: {new Date(currentJournalEntry.updated_at).toLocaleString()}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleManualSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JournalScreen;