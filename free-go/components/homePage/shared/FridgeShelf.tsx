import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { View, StyleSheet } from 'react-native';


  
interface FridgeBottomProps {
  children?: React.ReactNode;
}
const FridgeShelves: React.FC<FridgeBottomProps> = ({children}) => {
const colors = useThemeColor();
  
  const shelfStyle = {
    ...styles.shelf,
    backgroundColor: colors.shelf
  }
  return (
    <View >
      <View>{children}</View>
      <View style={shelfStyle} />
    </View>
  );
};

const styles = StyleSheet.create({

  shelf: {
    height: 2,
    marginBottom:"2%",
    backgroundColor: '#D3D3D3',
  },
  // container: {
  //   width: "100%",
  //   height: "20%",
  // }
});

export default FridgeShelves;
