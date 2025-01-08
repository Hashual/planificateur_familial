import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Button } from 'react-native';
import DoorShelfs from './DoorShelf';
import { ThemedButton } from '@/components/utilities/ThemedButton';
import { useRouter } from 'expo-router';
import { MeUserInfos } from '@/components/user/UserInfos';
import NavLoginButton from '@/components/auth/nav/LoginButton';

interface InsideDoorProps {
  children?: React.ReactNode;
}

const InsideDoor: React.FC<InsideDoorProps> = ({ children }) => {
  const router = useRouter();

  return (
    <View style={styles.insideContainer}>
      <View style={styles.inside}>
        <View style={styles.shelfContainer}>
          <ScrollView style={styles.scrollView}>
            <ThemedButton
              title="To-Do"
              onPress={() => router.push('/todolists')}
              type="primary"
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
              textStyle={{ fontSize: 10 }}
              style={styles.button}
              icon="basket"
              onTop={true}
            />
            <DoorShelfs />
            <NavLoginButton
              style={styles.button}
            />
            <DoorShelfs />
            <MeUserInfos />
            
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
    width: '95%', 
    height: '95%',
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
