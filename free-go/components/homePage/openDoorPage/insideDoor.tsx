import React from 'react';
import { View, StyleSheet } from 'react-native';
import DoorShelfs from './DoorShelf';
import { ThemedButton } from '@/components/ThemedButton';
import { useRouter } from 'expo-router';

interface InsideDoorProps {
  children?: React.ReactNode; // Permet d'ajouter des enfants
}

const InsideDoor: React.FC<InsideDoorProps> = ({ children }) => {
  const router = useRouter(); // Initialisation du router pour la navigation

  return (
    <View style={styles.insideContainer}>
      <View style={styles.inside}>
        <View style={styles.shelfContainer}>
          <DoorShelfs /> {/* Première étagère */}
          <ThemedButton
            title="To-Do"
            onPress={() => router.push('/todolists')} // Redirige vers la To-Do Liste
            type="primary"
            lightColor="#F5C754"
            darkColor="#F5C754"
            style={styles.button}
          />
          <DoorShelfs /> {/* Deuxième étagère */}
          <ThemedButton
            title="Liste des courses"
            onPress={() => router.push('/shoppinglists')} // Redirige vers la Liste des Courses
            type="primary"
            lightColor="#F5C754"
            darkColor="#F5C754"
            style={styles.button}
          />
          <DoorShelfs /> {/* Troisième étagère */}
          <DoorShelfs /> {/* Quatrième étagère */}
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
    transform: [{ skewX: '-0deg' }, { skewY: '-0deg' }], // Déformation horizontale et verticale
  },
  shelfContainer: {
    flex: 1,
    justifyContent: 'space-between', // Espacement uniforme des étagères
    paddingVertical: 10,
  },
  button: {
    marginVertical: 10, // Espacement entre les boutons
    alignSelf: 'center',
    width: '80%', // Largeur ajustée pour un bon alignement
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
