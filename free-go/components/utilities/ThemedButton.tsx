import React, { useState } from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, View, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Shadows } from '@/constants/Shadows';
import { ThemedText } from './ThemedText';

export type ThemedButtonVisualProps = {
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export type ThemedButtonProps = ThemedButtonVisualProps & {
  title?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onTop?: boolean;
  onPress: () => void;
  padV?: number;
  padH?: number;
};

export function ThemedButton({
  title,
  icon,
  onTop,
  onPress,
  type = 'primary',
  style,
  padV,
  padH
}: ThemedButtonProps) {
  const colors = useThemeColor();

  const buttonStyles = [
    styles.button,
    styles.center,
    {paddingVertical: padV ?? 12, paddingHorizontal: padH ?? 24},
    type === 'primary' && { backgroundColor: colors.primary },
    type === 'secondary' && { backgroundColor: colors.secondary },
    {...Shadows.dp2 },
    style,
  ];

  const [scale] = useState(new Animated.Value(1)); 

  const onPressIn = () => {
    Animated.timing(scale, {
      toValue: 0.8,
      duration: 80,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };
  
  const onPressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 80,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} >
      <Animated.View
        style={[
          buttonStyles,
          { transform: [{ scale }] },
        ]}
      > 
        
        <View style={[styles.center, {flexDirection: onTop ? "column" : "row"}]}>
        {icon && (
          <View style={[styles.iconContainer, {marginBottom: onTop ? 5 : 0, marginRight: onTop ? 0 : 10, borderColor: colors.fixedPrimaryText}]}>
            <MaterialCommunityIcons name={icon} size={20} color={colors.fixedPrimaryText} />
          </View>
        )}
        
        {title && <ThemedText variant='fs11Bold' color="fixedPrimaryText">{title}</ThemedText>}
      </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  iconContainer: {
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 2
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
