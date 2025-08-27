import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from './styles';
import { useJournal } from '../../hooks/useJournal';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const JournalHistoryScreen = ({ navigation }) => {
  const { journalEntries, isLoading, deleteEntry, refreshEntries } = useJournal();

  useEffect(() => {
    refreshEntries();
  }, []);

  const handleEntryPress = (entry) => {
    navigation.navigate('Journal', { selectedDate: entry.date, entry });
  };

  const handleDeleteEntry = (entry) => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete the journal entry for ${new Date(entry.date).toLocaleDateString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEntry(entry.date),
        },
      ]
    );
  };

  const renderJournalEntry = ({ item }) => {
    const entryDate = new Date(item.date);
    const isToday = item.date === new Date().toISOString().split('T')[0];
    
    return (
      <TouchableOpacity
        style={[styles.entryCard, isToday && styles.todayEntry]}
        onPress={() => handleEntryPress(item)}
      >
        <View style={styles.entryHeader}>
          <View>
            <Text style={styles.entryDate}>
              {entryDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {isToday && <Text style={styles.todayLabel}>Today</Text>}
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteEntry(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.entryPreview} numberOfLines={3}>
          {item.content}
        </Text>
        
        <Text style={styles.entryMeta}>
          {item.updated_at && `Last updated: ${new Date(item.updated_at).toLocaleString()}`}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading && journalEntries.length === 0) {
    return <LoadingSpinner message="Loading your journal entries..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Journal History</Text>
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => navigation.navigate('Journal')}
        >
          <Text style={styles.newEntryButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {journalEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Journal Entries</Text>
          <Text style={styles.emptyStateText}>
            Start writing your first journal entry to see it here.
          </Text>
          <TouchableOpacity
            style={styles.startWritingButton}
            onPress={() => navigation.navigate('Journal')}
          >
            <Text style={styles.startWritingButtonText}>Start Writing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={journalEntries}
          renderItem={renderJournalEntry}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default JournalHistoryScreen;