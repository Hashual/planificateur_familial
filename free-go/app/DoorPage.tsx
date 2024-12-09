import React from 'react';
import { View, StyleSheet } from 'react-native';
import Fridge from '@/components/homePage/shared/Fridge';
import DoorText from '@/components/homePage/doorPage/DoorText';
import Handle from '@/components/homePage/doorPage/Handle';
import HandleReflection from '@/components/homePage/doorPage/HandleReflection';
import DoorReflection from '@/components/homePage/doorPage/DoorReflection';
import Swipeable, { SwipeableMethods, SwipeableRef } from 'react-native-gesture-handler/ReanimatedSwipeable';
import FridgeBottom from '@/components/homePage/shared/FridgeBottom';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const DoorPage: React.FC = () => {
  const router = useRouter();

  const swipeableRef = React.useRef<SwipeableMethods>(null);

  // Actions pour le balayage à gauche
  const LeftSwipeAction = () => (
    <View style={[styles.swipeAction]}>
        <Fridge>  
          <FridgeBottom />
        </Fridge>    
    </View>
  );

  // Actions pour le balayage à droite
  const RightSwipeAction = () => (
    <View style={[styles.swipeAction]}>
        <Fridge>  
          <FridgeBottom />
        </Fridge>
    </View>
  );

  // Gestion de l'ouverture par balayage
  const handleSwipeOpen = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    router.push('/OpenDoorPage'); // Naviguer vers la page pour la porte ouverte vers la gauche   
  };

  return (
    
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <Swipeable
          ref={swipeableRef}
          renderLeftActions={LeftSwipeAction}
          renderRightActions={RightSwipeAction}
          onSwipeableWillOpen={() =>
            handleSwipeOpen()
          }
          dragOffsetFromLeftEdge={5}
          dragOffsetFromRightEdge={5}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
  },

});

export default DoorPage;
