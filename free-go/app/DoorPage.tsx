import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Fridge from '@/components/homePage/shared/Fridge';
import DoorText from '@/components/homePage/doorPage/DoorText';
import Handle from '@/components/homePage/doorPage/Handle';
import HandleReflection from '@/components/homePage/doorPage/HandleReflection';
import DoorReflection from '@/components/homePage/doorPage/DoorReflection';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import FridgeBottom from '@/components/homePage/shared/FridgeBottom';
import FridgeDoorAnimation from '@/components/homePage/animation/FridgeDoorAnimation';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const DoorPage: React.FC = () => {
  const router = useRouter();
  const swipeableRef = useRef<SwipeableMethods>(null);
  const [showAnimation, setShowAnimation] = useState(false); // Gérer l'état de l'animation

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 5000); // Déclencher après 5 secondes
    return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté
  }, []);

  const handleSwipeOpen = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    setShowAnimation(false); // Cacher l'animation dès que l'utilisateur interagit
      router.push('/OpenDoorPage');
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <Swipeable
          ref={swipeableRef}
          onSwipeableWillOpen={handleSwipeOpen}
          renderLeftActions={() => <View style={styles.fridge}><Fridge><FridgeBottom /></Fridge></View>}
          renderRightActions={() => <View style={styles.fridge}><Fridge><FridgeBottom /></Fridge></View>}
          dragOffsetFromLeftEdge={5}
          dragOffsetFromRightEdge={5}
          containerStyle={styles.container2}
          childrenContainerStyle={styles.container}
        >
          <FridgeDoorAnimation showAnimation={showAnimation} style={styles.fridge}>
              <Fridge>
                <DoorText />
                <Handle>
                  <HandleReflection />
                </Handle>
                <DoorReflection />
              </Fridge>
          </FridgeDoorAnimation>
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
  chevronContainer: {
    position: 'absolute',
    top: '43.5%',
    right: '-8.5%',
    transform: [{ translateY: -20 },{ rotate: '180deg' }],
    opacity: 0.5,
  },
  fridge: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }
});

export default DoorPage;