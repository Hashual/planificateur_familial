import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/Colors';
import { useFonts } from 'expo-font';


const DoorText: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Pacifico: require('@/assets/fonts/Pacifico.ttf'),
  });
  return <Text style={styles.text}>Free go</Text>;
};



const styles = StyleSheet.create({
  text: {
    fontFamily: 'Pacifico',
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textColor,
    bottom: '30%',
  },
});

export default DoorText;
