import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import DoorText from '../components/homePage/doorPage/DoorText';
import Handle from '../components/homePage/doorPage/Handle';
import HandleReflection from '../components/homePage/doorPage/HandleReflection';
import DoorReflection from '../components/homePage/doorPage/DoorReflection';
import Fridge from '../components/homePage/shared/Fridge';
import FridgeDoor from '../components/homePage/openDoorPage/FridgeDoor';
import FridgeBottom from '../components/homePage/shared/FridgeBottom';
import { ThemedButton } from '@/components/ThemedButton';

const HomePage: React.FC = () => {
  const [frame, setFrame] = useState(1); // État pour gérer les frames (1: porte fermée, 2: porte ouverte, 3: zoom)

  const handleFridgeClick = () => {
    // Passage à la frame suivante
    if (frame === 1) setFrame(2); // Ouvrir la porte
    else if (frame === 2) setFrame(3); // Zoomer sur le frigo
    else if (frame === 3) setFrame(2); // Revenir à la porte ouverte
    else setFrame(1); // Revenir à la porte fermée
  };

  return (
    <View style={styles.container}>
      {frame === 1 && (
        // Frame 1 : Porte du frigo fermée
        <TouchableOpacity onPress={handleFridgeClick}>
          <Fridge>
            <DoorText />
            <Handle>
              <HandleReflection />
            </Handle>
            <DoorReflection />
          </Fridge>
        </TouchableOpacity>
      )}

      {frame === 2 && (
        // Frame 2 : Porte du frigo ouverte
        <View>
          <TouchableOpacity onPress={handleFridgeClick}>
            <Fridge>
              <FridgeDoor />
              <FridgeBottom />
            </Fridge>
          </TouchableOpacity>
          {/* Boutons pour accéder à la To-Do List et à la Shopping List */}
          <ThemedButton
            title="To-Do Liste"
            onPress={() => console.log("Naviguer vers To-Do List")}
            type="primary"
            lightColor="#F5C754"
            darkColor="#F5C754"
            style={styles.button}
          />
          <ThemedButton
            title="Liste des courses"
            onPress={() => console.log("Naviguer vers Liste des Courses")}
            type="primary"
            lightColor="#F5C754"
            darkColor="#F5C754"
            style={styles.button}
          />
        </View>
      )}

      {frame === 3 && (
        // Frame 3 : Zoom sur le frigo
        <View style={styles.container}>
          <TouchableOpacity onPress={handleFridgeClick}>
            <Fridge>
              <FridgeBottom />
            </Fridge>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
  },
});

export default HomePage;
