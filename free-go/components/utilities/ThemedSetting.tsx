import React, { useState } from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, View, Animated, Easing } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Shadows } from '@/constants/Shadows';
import { ThemedText } from './ThemedText';

export type ThemedSettingVisualProps = {
  type?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export type ThemedSettingProps = ThemedSettingVisualProps & {
  title?: string;
  onTop?: boolean;
  onPress: () => void;
  padV?: number;
  padH?: number;
};

export function ThemedSetting({
  title,
  onTop,
  onPress,
  style,
  padV,
  padH
}: ThemedSettingProps) {

  const SettingStyles = [
    styles.Setting,
    styles.center,
    {paddingVertical: padV ?? 12, paddingHorizontal: padH ?? 24, borderWidth: 1,borderColor: 'black'},
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
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={{width: "100%"}}>
      <Animated.View
        style={[
          SettingStyles,
          { transform: [{ scale }] },
        ]}
      > 
        
        <View style={[styles.center, {flexDirection: onTop ? "column" : "row"}]}>
        
        {title && <ThemedText variant='fs11Bold' color="fixedPrimaryText">{title}</ThemedText>}
      </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Setting: {
    borderRadius: 8,
    width: "100%",
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
