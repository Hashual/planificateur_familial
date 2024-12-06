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

  // Gestion de l'événement lorsque le balayage est ouvert
  const handleSwipeOpen = (direction: string) => {
    if (direction === 'left') {
      router.push('/OpenDoorPage'); // Naviguer uniquement si le balayage est à gauche
    }
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        onSwipeableOpen={() => handleSwipeOpen('left')} // Appelée après un balayage valide
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
    backgroundColor: 'FFF',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    width: '100%',
  }
});

export default DoorPage;
