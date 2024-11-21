import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';

const HandleReflection: React.FC = () => {
  return <View style={styles.reflection} />;
};

const styles = StyleSheet.create({
  reflection: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.reflectionGray,
    opacity: 0.5,
    borderRadius: 3,
    left: '29%',
    bottom: '5%',
  },
});

export default HandleReflection;
