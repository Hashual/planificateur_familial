import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, Pressable } from 'react-native';
import { getMockData} from '@/mockapi/mockData';
import { MockData} from '@/mockapi/types';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function ToDoLists() {

  const [fontsLoaded] = useFonts({
    Pacifico: require('@/assets/fonts/Pacifico.ttf'), 
  });

  const [toDoData, setToDoData] = useState<MockData>({ toDoList: [] });

  const loadToDoData = async () => {
    try {
      const data = await getMockData();
      setToDoData(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadToDoData();
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <FlatList
        data={toDoData.toDoList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: list }) => (
          <Link href={{pathname: "/todolist/[id]", params: {id: list.id}}} asChild>
            <Pressable>
              <View style={[styles.category, styles.shadowElement]}>
                <Text style={styles.categoryTitle}>{list.name}</Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#141C24',
    textAlign: 'center',
    fontFamily: 'Pacifico'
  },
  category: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 5,
    borderRadius: 10,
    backgroundColor: "#E3E8F2",
    overflow: 'hidden'
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#141C24',
  },
  input: {
    borderColor: '#00796b',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  shadowElement: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 5,
  },
});