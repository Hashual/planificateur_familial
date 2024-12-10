import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import Fridge from '@/components/homePage/shared/Fridge';
import FridgeBottom from '@/components/homePage/shared/FridgeBottom';
import { useRouter } from 'expo-router';

const FridgeBack: React.FC = () => {
  const router = useRouter();

  const handleFridgeClick = () => {
    router.replace('/OpenDoorPage'); // Retourner à Page B
  };

  useEffect(() => {
    const backAction = () => {
      router.replace('/OpenDoorPage'); // Retourner à Page B sur bouton retour
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
      <TouchableOpacity onPress={handleFridgeClick} style={styles.fridgeBottom}>
        <Fridge>
          <FridgeBottom />
        </Fridge>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fridgeBottom: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FridgeBack;
