import React from 'react';
import { View, StyleSheet } from 'react-native';
import Fridge from '../shared/Fridge';
import DoorText from './DoorText';
import Handle from './Handle';
import HandleReflection from './HandleReflection';
import DoorReflection from './DoorReflection';

const DoorPage: React.FC = () => {
    return (
        <View style={styles.container}>
            <Fridge>
                <DoorText />
                <Handle>
                    <HandleReflection />
                </Handle>
                <DoorReflection />
            </Fridge>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
  
    },
  });

export default DoorPage;
