import React from 'react';
import { View, StyleSheet } from 'react-native';

const DoorReflection: React.FC = () => {
  return <View style={styles.reflection} />;
};

const styles = StyleSheet.create({
  reflection: {
    width: '2%',
    height: '60%',
    backgroundColor: "white",
    left: '5%',
    top: '5%',
    opacity: 0.5,
    borderRadius: 5,
  },
});

export default DoorReflection;
