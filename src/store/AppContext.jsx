import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const initialState = {
  selectedZodiacSign: 'Aries',
  horoscopeData: null,
  isLoadingHoroscope: false,
  journalEntries: [],
  currentJournalEntry: null,
  isLoadingJournal: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ZODIAC_SIGN':
      return { ...state, selectedZodiacSign: action.payload };
    case 'SET_HOROSCOPE_LOADING':
      return { ...state, isLoadingHoroscope: action.payload };
    case 'SET_HOROSCOPE_DATA':
      return { ...state, horoscopeData: action.payload, isLoadingHoroscope: false };
    case 'SET_JOURNAL_LOADING':
      return { ...state, isLoadingJournal: action.payload };
    case 'SET_JOURNAL_ENTRIES':
      return { ...state, journalEntries: action.payload };
    case 'SET_CURRENT_JOURNAL_ENTRY':
      return { ...state, currentJournalEntry: action.payload };
    case 'ADD_JOURNAL_ENTRY':
      // Check if entry already exists to prevent duplicates
      const entryExists = state.journalEntries.some(entry => entry.date === action.payload.date);
      if (entryExists) {
        return state;
      }
      return {
        ...state,
        journalEntries: [action.payload, ...state.journalEntries],
        currentJournalEntry: action.payload,
      };
    case 'UPDATE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.map(entry =>
          entry.date === action.payload.date ? action.payload : entry
        ),
        currentJournalEntry: action.payload,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved zodiac sign on app start
  useEffect(() => {
    const loadSavedZodiacSign = async () => {
      try {
        const savedSign = await AsyncStorage.getItem('selectedZodiacSign');
        if (savedSign && ZODIAC_SIGNS.includes(savedSign)) {
          dispatch({ type: 'SET_ZODIAC_SIGN', payload: savedSign });
        }
      } catch (error) {
        console.error('Error loading saved zodiac sign:', error);
      }
    };

    loadSavedZodiacSign();
  }, []);

  // Save zodiac sign when it changes
  useEffect(() => {
    const saveZodiacSign = async () => {
      try {
        await AsyncStorage.setItem('selectedZodiacSign', state.selectedZodiacSign);
      } catch (error) {
        console.error('Error saving zodiac sign:', error);
      }
    };

    saveZodiacSign();
  }, [state.selectedZodiacSign]);

  const setZodiacSign = useCallback((sign) => dispatch({ type: 'SET_ZODIAC_SIGN', payload: sign }), []);
  const setHoroscopeLoading = useCallback((loading) => dispatch({ type: 'SET_HOROSCOPE_LOADING', payload: loading }), []);
  const setHoroscopeData = useCallback((data) => dispatch({ type: 'SET_HOROSCOPE_DATA', payload: data }), []);
  const setJournalLoading = useCallback((loading) => dispatch({ type: 'SET_JOURNAL_LOADING', payload: loading }), []);
  const setJournalEntries = useCallback((entries) => dispatch({ type: 'SET_JOURNAL_ENTRIES', payload: entries }), []);
  const setCurrentJournalEntry = useCallback((entry) => dispatch({ type: 'SET_CURRENT_JOURNAL_ENTRY', payload: entry }), []);
  const addJournalEntry = useCallback((entry) => dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: entry }), []);
  const updateJournalEntry = useCallback((entry) => dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: entry }), []);
  const setError = useCallback((error) => dispatch({ type: 'SET_ERROR', payload: error }), []);
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  const contextValue = {
    state,
    dispatch,
    setZodiacSign,
    setHoroscopeLoading,
    setHoroscopeData,
    setJournalLoading,
    setJournalEntries,
    setCurrentJournalEntry,
    addJournalEntry,
    updateJournalEntry,
    setError,
    clearError,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
