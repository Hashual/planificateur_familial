import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import DoorShelfs from './DoorShelf';
import { ThemedButton } from '@/components/utilities/ThemedButton';
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
          <ScrollView style={styles.scrollView}>
            <ThemedButton
              title="To-Do"
              onPress={() => router.push('/todolists')}
              type="primary"
              textStyle={{ fontSize: 10 }}
              style={styles.button}
              icon='check'
              onTop={true}
            />
            <DoorShelfs />
            <ThemedButton
              title="Liste de course"
              onPress={() => router.push('/shoppinglists')}
              type="primary"
              textStyle={{ fontSize: 10 }}
              style={styles.button}
              icon='basket'
              onTop={true}
            />
            <DoorShelfs />
            
          </ScrollView>
        </View>
        {children ? <View style={styles.childrenContainer}>{children}</View> : null}
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
  scrollView: {
    width: '100%',
    paddingTop: StatusBar.currentHeight,
  },
});

export default InsideDoor;
