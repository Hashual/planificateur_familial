import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';

const DoorReflection: React.FC = () => {
  return <View style={styles.reflection} />;
};

const styles = StyleSheet.create({
  reflection: {
    width: '50%',
    height: 10,
    backgroundColor: COLORS.reflectionGray,
    opacity: 0.6,
    borderRadius: 5,
    position: 'absolute',
    top: '40%',
    right: '65%',
    transform: [{ rotate: '90deg' }],
  },
});

export default DoorReflection;
