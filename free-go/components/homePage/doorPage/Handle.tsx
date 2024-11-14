import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';

const Handle: React.FC = () => {
  return <View style={styles.handle} />;
};

const styles = StyleSheet.create({
  handle: {
    width: 60,
    height: 13,
    backgroundColor: COLORS.handleGray,
    borderRadius: 5,
    left: '30%',
    bottom: '4%',
  },
});

export default Handle;
