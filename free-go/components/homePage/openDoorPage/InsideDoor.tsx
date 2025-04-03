import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Button } from 'react-native';
import DoorShelfs from './DoorShelf';
import { ThemedButton } from '@/components/utilities/ThemedButton';
import { useRouter } from 'expo-router';
import { MeUserInfos } from '@/components/user/UserInfos';
import NavLoginButton from '@/components/auth/nav/LoginButton';
import { useThemeColor } from '@/hooks/useThemeColor';

interface InsideDoorProps {
  children?: React.ReactNode;
}

const InsideDoor: React.FC<InsideDoorProps> = ({ children }) => {
  const router = useRouter();
  const colors = useThemeColor();

  return (
    <View style={styles.insideContainer}>
      <View style={[styles.inside, {backgroundColor: colors.background}]}>
        <View style={styles.shelfContainer}>
          <ScrollView style={styles.scrollView}>
            <ThemedButton
              title="To-Do"
              onPress={() => router.push('/todolists')}
              type="primary"
              style={styles.button}
              icon="check"
              onTop={true}
              textStyle={styles.textButtonStyle}
              padH={0}
            />
            <DoorShelfs />
            <ThemedButton
              title="Shopping"
              onPress={() => router.push('/shoppinglists')}
              type="primary"
              style={styles.button}
              icon="basket"
              onTop={true}
              textStyle={styles.textButtonStyle}
              padH={0}
            />
            {/* <ThemedButton
              title="Famille"
              onPress={() => router.push('/families')}
              type="primary"
              textStyle={{ fontSize: 10 }}
              style={styles.button}
              icon="human"
              onTop={true}
            /> */}
            <DoorShelfs />
            <NavLoginButton
              style={styles.button}
            />
            <DoorShelfs />
            
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
  textButtonStyle: {
    fontSize: 11,
    fontWeight: "bold"
  }
});

export default InsideDoor;
