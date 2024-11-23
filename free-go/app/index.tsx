import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedButton } from '@/components/ThemedButton';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Bienvenue dans l'application de gestion de tâches !</Text>
      <ThemedButton
        title="Aller à la To-Do Liste"
        onPress={() => router.push("/todolists")} 
        type="primary"
        lightColor="#F5C754"
        darkColor="#F5C754"
        style={{marginBottom: 30}}
      />
      <ThemedButton
        title="Aller à la liste des courses"
        onPress={() => router.push("/shoppinglists")} 
        type="primary"
        lightColor="#F5C754"
        darkColor="#F5C754"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
