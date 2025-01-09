import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Shelf = () => {
  const colors = useThemeColor();
  return (
    <View style={[styles.shelf, {backgroundColor: colors.shelf}]}/>
  );
};

const styles = StyleSheet.create({
  // Structure de l'étagère
  shelf: {
    width: '80%', // Largeur de l'étagère relative à la porte
    height: 10, // Hauteur de l'étagère
    borderRadius: 10, // Coins arrondis pour le design
    left: '10%', // Décalage horizontal pour centrer l'étagère
    marginTop: 'auto', 
  },
});

export default Shelf;
