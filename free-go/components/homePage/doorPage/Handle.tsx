import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';

const Handle: React.FC = () => {
  return <View style={styles.handle} />;
};

const styles = StyleSheet.create({
  handle: {
    width: 50,
    height: 10,
    backgroundColor: COLORS.handleGray,
    borderRadius: 5,
  },
});

export default Handle;
