import React from 'react';
import { View, StyleSheet } from 'react-native';
import InsideDoor from '@/components/homePage/openDoorPage/InsideDoor';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';


const FridgeDoor = () => {
  const colors = useThemeColor();

  return (
    <View style={[styles.door, {backgroundColor: colors.fridge}]}>
      <InsideDoor />
    </View>
  );
};

const styles = StyleSheet.create({
  door: {
    width: '35%', // Largeur de la porte (relative au frigo)
    height: '100%', // Hauteur de la porte (relative au frigo)
    borderRadius: 30, // Coins arrondis pour le design
  },
});

export default FridgeDoor;
