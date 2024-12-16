import React from 'react';
import { View, StyleSheet } from 'react-native';

interface notificationBack {
  children: React.ReactNode;
}

const notificationBack: React.FC<notificationBack> = ({ children }) => {
  return <View style={styles.door}>{children}</View>;
};

const styles = StyleSheet.create({
  door: {
    width: '90%',
    height: '95%',
    backgroundColor: "#FFF",
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default notificationBack;
