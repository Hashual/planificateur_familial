import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

interface HandleProps { 
  children?: React.ReactNode;
}

const Handle: React.FC<HandleProps> = ({ children }) => {
  const colors = useThemeColor();
  return <View style={[styles.handle, {backgroundColor: colors.handleGray}]}>{children}</View>;
};

const styles = StyleSheet.create({
  handle: {
    position: 'absolute', // Permet un positionnement précis
    right: '2%', // Place la poignée proche du bord droit
    top: '45%', // Ajuste pour qu'elle soit environ au centre verticalement
    width: 60,
    height: 13,
    borderRadius: 5, // Coins arrondis pour la poignée
  },
});

export default Handle;
