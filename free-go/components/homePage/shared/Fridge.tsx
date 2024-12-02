import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';

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
    backgroundColor: COLORS.fridgeYellow,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default Fridge;
