import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';

const DoorText: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Pacifico: require('@/assets/fonts/Pacifico.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Retourne rien tant que les polices ne sont pas chargées
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Free-go</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Permet de positionner précisément sur l'écran
    top: '10%', // Ajuste la hauteur sur l'axe Y (par rapport au haut de la porte)
    left: 0,
    right: 0, // Combine `left` et `right` pour centrer horizontalement
    alignItems: 'center', // Centre sur l'axe X
  },
  text: {
    fontFamily: 'Pacifico',
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textColor,
  },
});

export default DoorText;
