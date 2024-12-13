import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

interface FridgeDoorAnimationProps {
  showAnimation: boolean;
  children: React.ReactNode;
  style?: ViewStyle; // Optional style prop
}

const FridgeDoorAnimation: React.FC<FridgeDoorAnimationProps> = ({ showAnimation, children, style }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showAnimation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(slideAnim, { toValue: -40, duration: 1200, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
      setTimeout(() => {
        slideAnim.stopAnimation();
      }, 3400);
    } else {
      slideAnim.stopAnimation();
    }
  }, [showAnimation]);

  return (
    <Animated.View style={[styles.container, style, { transform: [{ translateX: slideAnim }] }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',},
});

export default FridgeDoorAnimation;