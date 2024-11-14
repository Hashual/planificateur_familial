import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';

const DoorReflection: React.FC = () => {
  return <View style={styles.reflection} />;
};

const styles = StyleSheet.create({
  reflection: {
    width: '80%',
    height: 10,
    backgroundColor: COLORS.reflectionGray,
    opacity: 0.5,
    borderRadius: 5,
    position: 'absolute',
    top: '10%',
    transform: [{ rotate: '90deg' }],
  },
});

export default DoorReflection;
