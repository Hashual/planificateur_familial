import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Fridge {
  children: React.ReactNode;
}

const Fridge: React.FC<Fridge> = ({ children }) => {
  const colors = useThemeColor();

  return <View style={[styles.door, {backgroundColor: colors.fridge}]}>{children}</View>;
};

const styles = StyleSheet.create({
  door: {
    width: '90%',
    height: '95%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default Fridge;
