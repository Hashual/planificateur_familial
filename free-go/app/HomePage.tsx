import React from 'react';
import { View, StyleSheet } from 'react-native';
import DoorText from '../components/homePage/doorPage/DoorText';
import Handle from '../components/homePage/doorPage/Handle';
import HandleReflection from '../components/homePage/doorPage/HandleReflection';
import DoorReflection from '../components/homePage/doorPage/DoorReflection';
import Fridge from '../components/homePage/shared/Fridge';
import FridgeDoor from '../components/homePage/openDoorPage/FridgeDoor';
import DoorShelf from '../components/homePage/openDoorPage/DoorShelf'; 
import FridgeBottom from '../components/homePage/shared/FridgeBottom';


const HomePage: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* <Fridge>
        <DoorText />
        <Handle />
        <HandleReflection />
        <DoorReflection />
      </Fridge> */}

      

      <Fridge>
        <FridgeDoor/>
        <FridgeBottom/>
      </Fridge>

      {/* <Fridge>
        <FridgeBottom/>
      </Fridge> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'

  },
});

export default HomePage;
