import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './styles';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default LoadingSpinner;