import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';

const DoorText: React.FC = () => {
  return <Text style={styles.text}>free go</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textColor,
  },
});

export default DoorText;
