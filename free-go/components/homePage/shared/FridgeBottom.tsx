import React from 'react';
import { View, StyleSheet } from 'react-native';
import FridgeShelves from './FridgeShelf';

const FridgeBottom = () => {
  return (
    <View style={styles.container}>
      <View style={styles.outerBorder}>
        <View style={styles.innerContainer}>
          <FridgeShelves /> {/* Composant pour les étagères */}
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
    backgroundColor: '#FFD700', // Jaune pour l'extérieur
    borderRadius: 20, // Coins arrondis
    paddingRight: 5,
    
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Blanc pour l'intérieur
    borderRadius: 15,
    justifyContent: 'space-between', // Espacement uniforme
  },
});

export default FridgeBottom;
