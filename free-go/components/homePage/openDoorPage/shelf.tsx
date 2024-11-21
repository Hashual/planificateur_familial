import React from 'react';
import { View, StyleSheet } from 'react-native';

const Shelf = () => {
  return (
    <View style={styles.shelf}>
      <View style={styles.support} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Structure de l'étagère
  shelf: {
    width: '80%', // Largeur de l'étagère relative à la porte
    height: 10, // Hauteur de l'étagère
    backgroundColor: '#FFF8DC', // Couleur de fond de l'étagère (ivoire, ajustable)
    borderRadius: 5, // Coins arrondis pour un effet design
    position: 'absolute', // Permet de positionner l'étagère où tu veux
    top: '30%', // Place l'étagère à 30% de la hauteur de la porte (modifiable)
    left: '10%', // Décalage horizontal pour centrer l'étagère
    shadowColor: '#000', // Ombre pour un effet réaliste
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // Ombre pour Android
  },

  // Support de l'étagère (optionnel)
  support: {
    width: '100%',
    height: 3,
    backgroundColor: '#A9A9A9', // Couleur du support (gris clair)
    position: 'absolute',
    bottom: -3, // Place le support juste en dessous de l'étagère
  },
});

export default Shelf;
