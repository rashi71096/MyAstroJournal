import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import { AppProvider } from './src/store/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initDatabase } from './src/services/database';

const App = () => {

  useEffect(() => {
    // Initialize database when app starts
    const initializeApp = async () => {
      try {
        await initDatabase();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        Alert.alert(
          'Initialization Error',
          'Failed to initialize the app. Please restart the application.',
          [{ text: 'OK' }]
        );
      }
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle='light-content' />
      <AppProvider>
        <SafeAreaView style={styles.container}>
          <AppNavigator/>
        </SafeAreaView>
      </AppProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
