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
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import { RootView } from '@/components/utilities/RootView';

const DoorPage: React.FC = () => {
  const router = useRouter();
  const swipeableRef = useRef<SwipeableMethods>(null);
  const [showAnimation, setShowAnimation] = useState(false); // Gérer l'état de l'animation
  const sound = useRef<Audio.Sound | null>(null);


  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound: soundObject } = await Audio.Sound.createAsync(
          require('@/assets/sounds/fridge-door-open.mp3')
        );
        sound.current = soundObject;
      } catch (error) {
        console.error("Erreur lors du chargement du son :", error);
      }
    };

    loadSound();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    try {
      if (sound.current) {
        await sound.current.playAsync();
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du son :", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showAnimation) {
        setShowAnimation(true);
        // Réinitialiser l'état après 1 seconde (ajustez selon la durée de votre animation)
        setTimeout(() => {
          setShowAnimation(false);
        }, 3400);
    }}, 5000); // Déclencher après 5 secondes
    return () => {
      clearTimeout(timer); // Nettoyer le timer si le composant est démonté
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  const handleSwipeOpen = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    setShowAnimation(false); // Cacher l'animation dès que l'utilisateur interagit
    playSound(); // Jouer le son lors de l'ouverture
    router.push('/homePage/OpenDoorPage'); // Rediriger vers la page suivante
  };

    const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      // Si une animation est déjà en cours, on ne la relance pas
      if (!showAnimation) {
        setShowAnimation(true);
        // Réinitialiser l'état après 1 seconde (ajustez selon la durée de votre animation)
        setTimeout(() => {
          setShowAnimation(false);
        }, 3400); // Temps que vous souhaitez que l'animation dure
      }
    }).runOnJS(true);



  return (
    <RootView>
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
            <GestureDetector gesture={doubleTap} >
              <View collapsable={false} style={styles.container}>
              <Fridge>
                <DoorText />
                <Handle>
                  <HandleReflection />
                </Handle>
                <View style={styles.reflexion}>
                  <DoorReflection />
                </View>
              </Fridge>
              </View>
            </GestureDetector>
          </FridgeDoorAnimation>
        </Swipeable>
      </GestureHandlerRootView>
    </RootView>
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
  },
  reflexion: {
    flex: 1,
    height: '100%',
    width: "100%",
  }
});

export default DoorPage;
