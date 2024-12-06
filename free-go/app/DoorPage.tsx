import React from 'react';
import { View, StyleSheet } from 'react-native';
import Fridge from '@/components/homePage/shared/Fridge';
import DoorText from '@/components/homePage/doorPage/DoorText';
import Handle from '@/components/homePage/doorPage/Handle';
import HandleReflection from '@/components/homePage/doorPage/HandleReflection';
import DoorReflection from '@/components/homePage/doorPage/DoorReflection';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const DoorPage: React.FC = () => {
  const router = useRouter();

  // Actions pour le balayage à gauche
  const LeftSwipeAction = () => (
    <View style={[styles.swipeAction, styles.leftAction]}>
      {/* Optionnellement, ajoute des animations ou des styles ici */}
    </View>
  );

  // Actions pour le balayage à droite
  const RightSwipeAction = () => (
    <View style={[styles.swipeAction, styles.rightAction]}>
      {/* Optionnellement, ajoute des animations ou des styles ici */}
    </View>
  );

  // Gestion de l'ouverture par balayage
  const handleSwipeOpen = () => {
     router.push('/OpenDoorPage'); // Naviguer vers la page pour la porte ouverte vers la gauche   
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderLeftActions={LeftSwipeAction}
        renderRightActions={RightSwipeAction}
        onSwipeableOpen={(direction) =>
          handleSwipeOpen()
        }
        containerStyle={styles.container2}
        childrenContainerStyle={styles.container}
      >
        <Fridge>
          <DoorText />
          <Handle>
            <HandleReflection />
          </Handle>
          <DoorReflection />
        </Fridge>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    width: '100%',
  },
  swipeAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Largeur de l'action (optionnel)
  },
  leftAction: {
    backgroundColor: '#A0E7E5', // Couleur pour le balayage à gauche
  },
  rightAction: {
    backgroundColor: '#B4F8C8', // Couleur pour le balayage à droite
  },
});

export default DoorPage;
