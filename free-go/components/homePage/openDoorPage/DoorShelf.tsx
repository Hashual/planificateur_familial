import React from 'react';
import { View, StyleSheet } from 'react-native';

const Shelf = () => {
  return (
    <View style={styles.shelf}/>
  );
};

const styles = StyleSheet.create({
  // Structure de l'étagère
  shelf: {
    width: '80%', // Largeur de l'étagère relative à la porte
    height: 2, // Hauteur de l'étagère
    backgroundColor: '#D3D3D3', // Couleur de fond de l'étagère (ivoire, ajustable)
    left: '10%', // Décalage horizontal pour centrer l'étagère
    marginTop: 'auto', 
  },
});

export default Shelf;
