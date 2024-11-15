import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { getMockData, addTask, deleteTask } from '@/mockapi/mockData';
import { MockData, TaskList, Task } from '@/mockapi/types';
import { useFonts } from 'expo-font';

export default function ToDolist() {

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

  const handleDeleteTask = async (listId: number, taskId: number) => {
    try {
      const updatedData = await deleteTask(listId, taskId);
      setToDoData(updatedData);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = async (listId: number, newTaskName: string) => {
    if (newTaskName.trim()) {
      try {
        const newTask: Task = {
          id: Date.now(),
          name: newTaskName,
          dueDate: null,
          completedDate: null,
        };
        const updatedData = await addTask(listId, newTask);
        setToDoData(updatedData);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const getTaskStyle = (task: Task) => {
    const now = new Date();
    if (task.completedDate) {
      return styles.completedTask;
    }
    if (!task.completedDate && task.dueDate && new Date(task.dueDate) < now) {
      return styles.overdueTask;
    }
    return styles.pendingTask;
  };

  useEffect(() => {
    loadToDoData();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />; // Afficher un indicateur de chargement jusqu'à ce que la police soit prête
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <FlatList
        data={toDoData.toDoList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: list }) => (
          <View style={styles.category}>
            <Text style={styles.categoryTitle}>{list.name}</Text>
            <FlatList
              data={list.tasks}
              keyExtractor={(task) => task.id.toString()}
              renderItem={({ item: task }) => (
                <View style={styles.taskItem}>
                  <Text style={getTaskStyle(task)}>{task.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(list.id, task.id)}
                  >
                    <Text style={styles.deleteButton}>❌</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder={`Ajouter une tâche à ${list.name}...`}
              onSubmitEditing={(e) =>
                handleAddTask(list.id, e.nativeEvent.text)
              }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00796b',
    textAlign: 'center',
    fontFamily: 'Pacifico'
  },
  category: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#004d40',
  },
  input: {
    borderColor: '#00796b',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#BDBDBD"
  },
  pendingTask: {
    color: "#000",
  },
  overdueTask: {
    color: "#d32f2f",
  },
  deleteButton: {
    color: '#d32f2f',
  },
});