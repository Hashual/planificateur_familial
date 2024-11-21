import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';

interface FridgeDoorProps {
  children: React.ReactNode;
}

const FridgeDoor: React.FC<FridgeDoorProps> = ({ children }) => {
  return <View style={styles.door}>{children}</View>;
};

const styles = StyleSheet.create({
  door: {
    width: '30%',
    right: '30%',
    height: '95%',
    backgroundColor: COLORS.fridgeYellow,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FridgeDoor;
