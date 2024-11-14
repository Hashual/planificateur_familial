import React from 'react';
import { View, StyleSheet } from 'react-native';
import DoorText from '../components/homePage/doorPage/DoorText';
import Handle from '../components/homePage/doorPage/Handle';
import HandleReflection from '../components/homePage/doorPage/HandleReflection';
import DoorReflection from '../components/homePage/doorPage/DoorReflection';
import FridgeDoor from '../components/homePage/shared/FridgeDoor';


const HomePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <FridgeDoor>
        <DoorText />
        <Handle />
        <HandleReflection />
        <DoorReflection />
      </FridgeDoor>
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
});

export default HomePage;
