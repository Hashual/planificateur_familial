import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Fridge from '../components/homePage/shared/Fridge';
import DoorText from '../components/homePage/doorPage/DoorText';
import Handle from '../components/homePage/doorPage/Handle';
import HandleReflection from '../components/homePage/doorPage/HandleReflection';
import DoorReflection from '../components/homePage/doorPage/DoorReflection';
import { useRouter } from 'expo-router';

const DoorPage: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('../OpenDoorPage');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleClick}>
        <Fridge>
          <DoorText />
          <Handle>
            <HandleReflection />
          </Handle>
          <DoorReflection />
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
});

export default DoorPage;
