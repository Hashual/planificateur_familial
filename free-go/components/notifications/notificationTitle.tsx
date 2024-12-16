import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface NotificationTitleProps {
  title: string; // Texte du titre
}

const NotificationTitle: React.FC<NotificationTitleProps> = ({ title }) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
});

export default NotificationTitle;
