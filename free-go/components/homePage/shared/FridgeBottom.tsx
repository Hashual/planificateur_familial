import React from 'react';
import { View, StyleSheet } from 'react-native';
import FridgeShelves from './FridgeShelf';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

const FridgeBottom = () => {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <View style={[styles.outerBorder, {backgroundColor: colors.fridge}]}>
        <View style={[styles.innerContainer, {backgroundColor: colors.background}]}>
          <FridgeShelves />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerBorder: {
    width: '95%',
    height: '95%',
    borderRadius: 20, // Coins arrondis
    
    
  },
  innerContainer: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'space-between', // Espacement uniforme
  },
});

export default FridgeBottom;
