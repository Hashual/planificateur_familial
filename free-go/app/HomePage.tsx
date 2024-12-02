import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import Fridge from '../components/homePage/shared/Fridge';
import DoorText from '../components/homePage/doorPage/DoorText';
import Handle from '../components/homePage/doorPage/Handle';
import HandleReflection from '../components/homePage/doorPage/HandleReflection';
import DoorReflection from '../components/homePage/doorPage/DoorReflection';
import DoorPage from './DoorPage';

const HomePage: React.FC = () => {
  const router = useRouter();

  const navigateToOpenDoor = () => {
    router.push('../OpenDoorPage'); // Redirige vers la page de porte ouverte
  };

  return (
    <View style = {styles.container}>
      <DoorPage/>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white-grey',
  },
});

export default HomePage;
