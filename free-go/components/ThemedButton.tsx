import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Image, View, Animated, Easing } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Shadows } from '@/constants/Shadows';
import { Colors } from '@/constants/Colors';

export type ThemedButtonProps = {
  title?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onTop?: boolean;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outlined';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function ThemedButton({
  title,
  icon,
  onTop,
  onPress,
  type = 'primary',
  style,
  textStyle,
}: ThemedButtonProps) {
  const colors = useThemeColor();
  const backgroundColor = colors.primary;
  const textColor = colors.primaryText;

  const buttonStyles = [
    styles.button,
    type === 'primary' && { backgroundColor: backgroundColor },
    type === 'secondary' && styles.secondary,
    type === 'outlined' && styles.outlined,
    {...Shadows.dp2 },
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
        
        <View style={ !onTop ? styles.buttonContentNextTo : styles.buttonContentOnTop}>
        {icon && (
          <View style={ !onTop ? styles.iconContainerNextTo : styles.iconContainerOnTop}>
            <MaterialCommunityIcons name={icon} size={20} color="#141C24" />
          </View>
        )}

        {/* Affiche le texte si title est défini */}
        {title && <Text style={[textStyles, { color: textColor }]}>{title}</Text>}
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
    resizeMode: 'contain', // Conserve les proportions de l'image
  },
  buttonContentNextTo: {
    alignItems: 'center', // Aligne le contenu verticalement
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContentOnTop:{
    alignItems: 'center', // Aligne le contenu verticalement
    justifyContent: 'center',
    flexDirection: 'column',

  },
  iconContainerNextTo: {
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#141C24',
    marginRight: 10,
  },
  iconContainerOnTop: {
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#141C24',
    marginBottom: 5,
  },  
});
