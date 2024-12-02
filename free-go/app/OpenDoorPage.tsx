import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Fridge from '../components/homePage/shared/Fridge';
import FridgeDoor from '../components/homePage/openDoorPage/FridgeDoor';
import FridgeBottom from '../components/homePage/shared/FridgeBottom';
import { ThemedButton } from '@/components/ThemedButton';
import { useRouter } from 'expo-router';

const OpenDoorPage: React.FC = () => {
  const router = useRouter();

  const handleFridgeClick = () => {
    router.push('../fridgeBack/FridgeBack');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFridgeClick}>
        <Fridge>
          <FridgeDoor />
          <FridgeBottom />
        </Fridge>
      </TouchableOpacity>

      <ThemedButton
        title="To-Do Liste"
        onPress={() => router.push('/todolists')}
        type="primary"
        lightColor="#F5C754"
        darkColor="#F5C754"
        style={styles.button}
      />
      <ThemedButton
        title="Liste des courses"
        onPress={() => router.push('/shoppinglists')}
        type="primary"
        lightColor="#F5C754"
        darkColor="#F5C754"
        style={styles.button}
      />
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
