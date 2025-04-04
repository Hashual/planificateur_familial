import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/utilities/ThemedText';

const DoorText: React.FC = () => {
  return (
    <View style={styles.container}>
      <ThemedText variant="mainTitle" color="fixedPrimaryText">Free-Go</ThemedText>
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
  }
});

export default DoorText;
