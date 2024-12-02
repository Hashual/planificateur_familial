import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Fridge from '../components/homePage/shared/Fridge';
import FridgeDoor from '../components/homePage/openDoorPage/FridgeDoor';
import FridgeBottom from '../components/homePage/shared/FridgeBottom';
import { useRouter } from 'expo-router';

const OpenDoorPage: React.FC = () => {
  const router = useRouter();

  const handleFridgeClick = () => {
    router.push('/FridgeBack');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFridgeClick}>
        <Fridge>
          <FridgeDoor />
          <FridgeBottom />
        </Fridge>
      </TouchableOpacity>
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
  button: {
    marginTop: 10,
  },
});

export default OpenDoorPage;
