import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      color: '#333',
    },
    scrollView: {
      flexGrow: 0,
    },
    signButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    selectedSignButton: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
    },
    signText: {
      fontSize: 14,
      color: '#666',
      fontWeight: '500',
    },
    selectedSignText: {
      color: '#fff',
    },
  });

export default styles;