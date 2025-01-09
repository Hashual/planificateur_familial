import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const FridgeShelves = () => {
  const colors = useThemeColor();
  
  const shelfStyle = {
    ...styles.shelf,
    backgroundColor: colors.shelf
  }
  return (
    <View style={styles.shelfContainer}>
      <View style={shelfStyle} />
      <View style={shelfStyle} />
      <View style={shelfStyle} />
      <View style={shelfStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  shelfContainer: {
    flex: 1,
    justifyContent: 'space-evenly', // Espacement uniforme
    paddingHorizontal: 15,
  },
  shelf: {
    height: 2,
    backgroundColor: '#D3D3D3', // Gris clair pour la division
  },
});

export default FridgeShelves;
