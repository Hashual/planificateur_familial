import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import Fridge from '@/components/homePage/shared/Fridge';
import FridgeBottom from '@/components/homePage/shared/FridgeBottom';
import { useRouter } from 'expo-router';
import { SetBackPage } from '@/utils/SetBackPage';

const FridgeBack: React.FC = () => {
  const router = useRouter();

  const handleFridgeClick = () => {
    router.replace('/homePage/OpenDoorPage'); // Retourner à Page B
  };

  SetBackPage('/homePage/OpenDoorPage');

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
