import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import DoorShelfs from './DoorShelf';
import { ThemedButton } from '@/components/ThemedButton';
import { useRouter } from 'expo-router';

interface InsideDoorProps {
  children?: React.ReactNode; // Permet d'ajouter des enfants
}

const InsideDoor: React.FC<InsideDoorProps> = ({ children }) => {
  const router = useRouter(); // Initialisation du router pour la navigation

  // Configuration des notifications
  useEffect(() => {
    const configureNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    configureNotifications();
  }, []);

  // Fonction pour envoyer une notification
  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Tâche ajoutée ! ✅',
        body: 'N’oublie pas de compléter ta nouvelle tâche dans la To-Do List.',
        sound: true, // Activer le son pour la notification
      },
      trigger: null, // Envoyer immédiatement
    });
  };

  return (
    <View style={styles.insideContainer}>
      <View style={styles.inside}>
        <View style={styles.shelfContainer}>
          <ScrollView style={styles.scrollView}>
            <ThemedButton
              title="To-Do"
              onPress={() => router.push('/todolists')}
              type="primary"
              lightColor="#F5C754"
              darkColor="#F5C754"
              textStyle={{ fontSize: 10 }}
              style={styles.button}
              icon="check"
              onTop={true}
            />
            <DoorShelfs />
            <ThemedButton
              title="Liste de course"
              onPress={() => router.push('/shoppinglists')}
              type="primary"
              lightColor="#F5C754"
              darkColor="#F5C754"
              textStyle={{ fontSize: 10 }}
              style={styles.button}
              icon="basket"
              onTop={true}
            />
            <DoorShelfs />

            {/* Nouveau bouton pour envoyer une notification */}
            <View style={styles.notificationButton}>
              <Button title="Envoyer une notification" onPress={sendNotification} color="#F5C754" />
            </View>
          </ScrollView>
        </View>
        {children ? <View style={styles.childrenContainer}>{children}</View> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  insideContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inside: {
    width: '95%', // Largeur relative pour s'adapter à la porte
    height: '95%', // Hauteur relative pour s'adapter à la porte
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    transform: [{ skewX: '-0deg' }, { skewY: '-0deg' }],
  },
  shelfContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  button: {
    marginVertical: 10,
    alignSelf: 'center',
    width: '80%',
  },
  notificationButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  childrenContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
    paddingTop: StatusBar.currentHeight,
  },
});

export default InsideDoor;
