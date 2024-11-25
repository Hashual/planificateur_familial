import React from 'react';
import { View, StyleSheet } from 'react-native';
import DoorShelfs from './DoorShelf';

interface InsideDoorProps {
  children?: React.ReactNode; // Permet d'ajouter des enfants
}

const InsideDoor: React.FC<InsideDoorProps> = ({ children }) => {
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
        {children && <View style={styles.childrenContainer}>{children}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  insideContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inside: {
    width: '95%', // Largeur relative pour s'adapter à la porte
    height: '95%', // Hauteur relative pour s'adapter à la porte
    backgroundColor: '#FFFFFF', // Couleur blanche
    borderRadius: 20, // Coins légèrement arrondis
    transform: [{ skewX: '-0deg' }, { skewY: '-5deg' }], // Déformation horizontale et verticale
  },
  shelfContainer: {
    flex: 1,
    justifyContent: 'space-between', // Espacement uniforme des étagères
    paddingVertical: 10,
  },
  childrenContainer: {
    position: 'absolute', // Permet de superposer les enfants sans affecter les étagères
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InsideDoor;
