import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Image, View, Animated, Easing } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export type ThemedButtonProps = {
  title: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap,
  onPress: () => void;
  lightColor?: string;
  darkColor?: string;
  type?: 'primary' | 'secondary' | 'outlined';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function ThemedButton({
  title,
  icon,
  onPress,
  lightColor,
  darkColor,
  type = 'primary',
  style,
  textStyle,
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor ?? Colors.light.primary, dark: darkColor ?? Colors.dark.primary }, 'background');
  const textColor = useThemeColor({ light: '#141C24', dark: '#141C24' }, 'text');

  const buttonStyles = [
    styles.button,
    type === 'primary' && { backgroundColor: backgroundColor },
    type === 'secondary' && styles.secondary,
    type === 'outlined' && styles.outlined,
    styles.shadowElement,
    style, 
  ];

  const textStyles = [
    styles.text,
    type === 'outlined' && styles.outlinedText,
    textStyle,
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
        <View style={styles.buttonContent}>
        {icon && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={icon} size={20} color="#141C24" />
          </View>
        )}
        <Text style={[textStyles, { color: textColor }]}>{title}</Text>
      </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowElement: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondary: {
    backgroundColor: '#E3E8F2',
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#141C24',
    backgroundColor: 'transparent',
  },
  outlinedText: {
    color: '#141C24',
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#141C24"
  },
});
