import React from 'react';
import { View, StyleSheet } from 'react-native';

const FridgeShelves = () => {
  return (
    <View style={styles.shelfContainer}>
      {/* Les différentes étagères */}
      <View style={styles.shelf} />
      <View style={styles.shelf} />
      <View style={styles.shelf} />
      <View style={styles.shelf} />
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
