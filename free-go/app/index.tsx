import React from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedButton } from '@/components/ThemedButton';
import { useFonts } from 'expo-font';

export default function Index() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Pacifico: require("@/assets/fonts/Pacifico.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bienvenue dans Free-Go !</Text>
      <View>
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
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontFamily: "Pacifico",
  },
});
