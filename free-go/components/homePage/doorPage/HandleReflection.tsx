import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

const HandleReflection: React.FC = () => {
  return <View style={styles.reflection} />;
};

const styles = StyleSheet.create({
  reflection: {
    margin: 'auto',
    width: 40,
    height: 5,
    backgroundColor: Colors.light.white,
    opacity: 0.5,
    borderRadius: 3,
  },
});

export default HandleReflection;
