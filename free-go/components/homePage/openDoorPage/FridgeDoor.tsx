import React from 'react';
import { View, StyleSheet } from 'react-native';
import InsideDoor from './InsideDoor';
import { COLORS } from '../../../constants/Colors';


const FridgeDoor = () => {
  return (
    <View style={styles.door}>
      <InsideDoor />
    </View>
  );
};

const styles = StyleSheet.create({
  door: {
    width: '30%', // Largeur de la porte (relative au frigo)
    height: '100%', // Hauteur de la porte (relative au frigo)
    backgroundColor: COLORS.fridgeYellow,//'#0000FF', 
    borderRadius: 30, // Coins arrondis pour le design
  },
});

export default FridgeDoor;
