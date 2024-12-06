import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Fridge from '@/components/homePage/shared/Fridge';
import FridgeBottom from '@/components/homePage/shared/FridgeBottom';
import { useRouter } from 'expo-router';

const FridgeBack: React.FC = () => {
  const router = useRouter();

  const handleFridgeClick = () => {
    router.push('../OpenDoorPage');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFridgeClick}>
        <Fridge>
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
});

export default FridgeBack;
