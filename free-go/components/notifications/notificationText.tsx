import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface NotificationTextProps {
  text: string; // Texte du contenu
}

const NotificationText: React.FC<NotificationTextProps> = ({ text }) => {
  return <Text style={styles.text}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#666666',
  },
});

export default NotificationText;
