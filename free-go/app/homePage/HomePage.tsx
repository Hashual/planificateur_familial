import React from 'react';
import { View, StyleSheet} from 'react-native';
import DoorPage from './DoorPage';
import { RootView } from '@/components/utilities/RootView';

const HomePage: React.FC = () => {

  return (
    <RootView style = {styles.container}>
      <DoorPage/>
    </RootView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});

export default HomePage;
