import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Fridge from '../../components/homePage/shared/Fridge';
import FridgeDoor from '../../components/homePage/openDoorPage/FridgeDoor';
import FridgeBottom from '../../components/homePage/shared/FridgeBottom';
import { useRouter } from 'expo-router';
import { SetBackPage } from '@/utils/SetBackPage';
import { RootView } from '@/components/utilities/RootView';

const OpenDoorPage: React.FC = () => {
  const router = useRouter();

  const handleFridgeClick = () => {
    router.replace('/homePage/FridgeBack'); // Naviguer vers Page C
  };

  SetBackPage('/');

  return (
    <RootView style={styles.container}>
      <Fridge>
        <FridgeDoor />
        <TouchableOpacity onPress={handleFridgeClick} style={styles.fridgeBottom}>
          <FridgeBottom />
        </TouchableOpacity>
      </Fridge>
    </RootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
