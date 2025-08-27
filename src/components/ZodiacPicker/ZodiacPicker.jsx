import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ZODIAC_SIGNS } from '../../store/AppContext';
import styles from './styles';

const ZodiacPicker = ({ selectedSign, onSignSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Zodiac Sign</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {ZODIAC_SIGNS.map((sign) => (
          <TouchableOpacity
            key={sign}
            style={[
              styles.signButton,
              selectedSign === sign && styles.selectedSignButton,
            ]}
            onPress={() => onSignSelect(sign)}
          >
            <Text
              style={[
                styles.signText,
                selectedSign === sign && styles.selectedSignText,
              ]}
            >
              {sign}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ZodiacPicker;