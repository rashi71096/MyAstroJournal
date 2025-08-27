import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from './styles';
import { useAppContext } from '../../store/AppContext';
import { useHoroscope } from '../../hooks/useHoroscope';
import { ZodiacPicker } from '../../components/ZodiacPicker';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const getTodayDisplayString = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const HomeScreen = ({ navigation }) => {
  const { state, setZodiacSign } = useAppContext();
  const { horoscopeData, isLoading, error, refetch } = useHoroscope();

  const handleZodiacSignChange = (sign) => {
    setZodiacSign(sign);
  };

  const handleWriteJournal = () => {
    navigation.navigate('Journal');
  };

  const showErrorAlert = () => {
    Alert.alert(
      'Connection Error',
      'Unable to fetch today\'s horoscope. Please check your internet connection and try again.',
      [
        { text: 'OK', style: 'default' },
        { text: 'Retry', onPress: refetch },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Astro Journal</Text>
        <Text style={styles.date}>{getTodayDisplayString()}</Text>
      </View>

      <ZodiacPicker
        selectedSign={state.selectedZodiacSign}
        onSignSelect={handleZodiacSignChange}
      />

      <View style={styles.horoscopeSection}>
        <Text style={styles.sectionTitle}>Today's Horoscope for {state.selectedZodiacSign}</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner message="Fetching your horoscope..." />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No horoscope data available</Text>
            <Text style={styles.errorSubtext}>
              Please check your internet connection and try again
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={showErrorAlert}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : horoscopeData ? (
          <View style={styles.horoscopeCard}>
            <Text style={styles.horoscopeText}>{horoscopeData.horoscope}</Text>
            <Text style={styles.horoscopeDate}>
              Updated: {new Date(horoscopeData.date).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No horoscope data available</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.journalButton} onPress={handleWriteJournal}>
          <Text style={styles.journalButtonText}>Write Journal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.historyButton} 
          onPress={() => navigation.navigate('JournalHistory')}
        >
          <Text style={styles.historyButtonText}>View Past Entries</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;