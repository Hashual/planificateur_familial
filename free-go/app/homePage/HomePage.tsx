import React from 'react';
import { View, StyleSheet} from 'react-native';
import DoorPage from './DoorPage';

const HomePage: React.FC = () => {

  return (
    <View style = {styles.container}>
      <DoorPage/>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'FFF',  },
});

export default HomePage;
