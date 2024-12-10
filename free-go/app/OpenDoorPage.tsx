import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import Fridge from '../components/homePage/shared/Fridge';
import FridgeDoor from '../components/homePage/openDoorPage/FridgeDoor';
import FridgeBottom from '../components/homePage/shared/FridgeBottom';
import { useRouter } from 'expo-router';

const OpenDoorPage: React.FC = () => {
  const router = useRouter();

  const handleFridgeClick = () => {
    router.replace('/FridgeBack'); // Naviguer vers Page C
  };

  useEffect(() => {
    const backAction = () => {
      router.replace('/'); // Retourner à Page A quand on est sur Page B
      return true; // Empêche le comportement par défaut du bouton retour
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Nettoyer l'écouteur sur démontage du composant
  }, []);

  return (
    <View style={styles.container}>
      <Fridge>
        <FridgeDoor />
        <TouchableOpacity onPress={handleFridgeClick} style={styles.fridgeBottom}>
          <FridgeBottom />
        </TouchableOpacity>
      </Fridge>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fridgeBottom: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default OpenDoorPage;
