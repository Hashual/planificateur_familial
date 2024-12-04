import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

interface HandleProps { 
  children?: React.ReactNode;
}

const Handle: React.FC<HandleProps> = ({ children }) => {
  return <View style={styles.handle}>{children}</View>;
};

const styles = StyleSheet.create({
  handle: {
    position: 'absolute', // Permet un positionnement précis
    right: '2%', // Place la poignée proche du bord droit
    top: '45%', // Ajuste pour qu'elle soit environ au centre verticalement
    width: 60,
    height: 13,
    backgroundColor: Colors.light.handleGray, // Couleur de la poignée
    borderRadius: 5, // Coins arrondis pour la poignée
  },
});

export default Handle;
