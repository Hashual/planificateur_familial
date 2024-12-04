import React from 'react';
import { View, StyleSheet } from 'react-native';
import FridgeShelves from './FridgeShelf';
import { Colors } from '@/constants/Colors';

const FridgeBottom = () => {
  return (
    <View style={styles.container}>
      <View style={styles.outerBorder}>
        <View style={styles.innerContainer}>
          <FridgeShelves />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerBorder: {
    width: '95%',
    height: '95%',
    backgroundColor: Colors.light.fridge, // Jaune pour l'extérieur
    borderRadius: 20, // Coins arrondis
    
    
  },
  innerContainer: {
    flex: 1,
    backgroundColor: Colors.light.white, // Blanc pour l'intérieur
    borderRadius: 15,
    justifyContent: 'space-between', // Espacement uniforme
  },
});

export default FridgeBottom;
