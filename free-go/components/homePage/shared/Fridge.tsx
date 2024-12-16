import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface Fridge {
  children: React.ReactNode;
}

const Fridge: React.FC<Fridge> = ({ children }) => {
  return <View style={styles.door}>{children}</View>;
};

const styles = StyleSheet.create({
  door: {
    width: '90%',
    height: '95%',
    backgroundColor: Colors.light.fridge,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default Fridge;
