import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import Fridge from '@/components/homePage/shared/Fridge';
import FridgeBottom from '@/components/homePage/shared/FridgeBottom';
import { useRouter } from 'expo-router';
import { SetBackPage } from '@/utils/SetBackPage';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RootView } from '@/components/utilities/RootView';

const FridgeBack: React.FC = () => {
  const router = useRouter();
  const colors = useThemeColor();

  const handleFridgeClick = () => {
    router.replace('/homePage/OpenDoorPage'); // Retourner à Page B
  };

  SetBackPage('/homePage/OpenDoorPage');

  return (
    <RootView>
      <TouchableOpacity onPress={handleFridgeClick} style={styles.fridgeBottom}>
        <Fridge>
          <FridgeBottom />
        </Fridge>
      </TouchableOpacity>
    </RootView>
  );
};

const styles = StyleSheet.create({
  fridgeBottom: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FridgeBack;
