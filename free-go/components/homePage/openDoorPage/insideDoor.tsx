import React from 'react';
import { View, StyleSheet } from 'react-native';
import DoorShelfs from './DoorShelf';

const InsideDoor = () => {
  return (
    <View style={styles.insideContainer}>
      <View style={styles.inside}>
        <View style={styles.shelfContainer}>
          <DoorShelfs /> {/* Première étagère */}
          <DoorShelfs /> {/* Deuxième étagère */}
          <DoorShelfs /> {/* Troisième étagère */}
          <DoorShelfs /> {/* Quatrième étagère */}
          <DoorShelfs /> {/* Cinquième étagère */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  insideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inside: {
    marginLeft:20,
    width: '90%', // Largeur relative pour s'adapter à la porte
    height: '90%', // Hauteur relative pour s'adapter à la porte
    backgroundColor: '#FFFFFF', // Couleur blanche
    borderRadius: 20, // Coins légèrement arrondis
    transform: [{ skewX: '-0deg' }, { skewY: '-1deg' }], // Déformation horizontale et verticale
  },
  shelfContainer: {
    flex: 1,
    justifyContent: 'space-between', // Espacement uniforme des étagères
    paddingVertical: 10,
    
  },
});

export default InsideDoor;
