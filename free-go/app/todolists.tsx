import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { getMockData, addTask, deleteTask, updateTask } from '@/mockapi/mockData';
import { MockData, TaskList, Task } from '@/mockapi/types';
import { useFonts } from 'expo-font';
import TaskItem from '@/components/TaskItem';

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

  const handleCompleteTask = async (listId: number, taskId: number) => {
    try {
      const taskList = toDoData.toDoList.find((list) => list.id === listId);
      const task = taskList?.tasks.find((task) => task.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      if (!task.id) {
        throw new Error("Task is missing an ID");
      }
 
      const updatedTask = { ...task };
  
      if (updatedTask.completedDate) {
        updatedTask.completedDate = null;
      } else {
        updatedTask.completedDate = new Date();
      }
  
      const updatedData = await updateTask(listId, updatedTask);
      setToDoData(updatedData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error completing task:", error.message);
      } else {
        console.error("Unknown error occurred");
      }
    }
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
                <TaskItem 
                  task={task}
                  listId={list.id}
                  handleDeleteTask={handleDeleteTask}
                  handleCompleteTask={handleCompleteTask}
                />  
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
    marginBottom: 20,
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