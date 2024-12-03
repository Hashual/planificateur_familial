import React, { useState, useCallback } from "react";
import {StyleSheet, FlatList, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { createTaskList, deleteTaskList, getMockData } from "@/mockapi/mockData";
import { MockData } from "@/mockapi/types";

import { ThemedButton } from "@/components/ThemedButton";
import ListItem from "@/components/ListItem";
import LoadFont from "@/utils/LoadFont";
import Error from "@/utils/alerts/Error";
import Confirmation from "@/utils/alerts/Confirmation";
import AppListModal from "@/components/modals/AddListModal";
import ThemedStatusBar, { StatusBarStyle } from "@/components/utilities/ThemedStatusBar";
import { Colors } from "@/constants/Colors";

export default function ToDoLists() {
  const loadedError = LoadFont({
    "Pacifico": require("@/assets/fonts/Pacifico.ttf"),
  })
  if (loadedError) { return loadedError; }

  const [mockData, setMockData] = useState<MockData>({ toDoLists: [], shoppingLists: [] });
  const [isModalVisible, setModalVisible] = useState(false);
  const [toDoListNameInputValue, setToDoListNameInputValue] = useState("");

  const loadMockData = async () => {
    try {
      const data = await getMockData();
      setMockData(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAddTaskList = async () => {
    const newTaskListName = toDoListNameInputValue.trim();

    if (newTaskListName) {
      try {
        await createTaskList(newTaskListName);
        setToDoListNameInputValue("");
        await loadMockData();
        closeModal();
      } catch (error) {
        Error("Erreur", "Il y a eu un problème lors de la création de la liste.", error);
      }
    } else {
      Error("Entrée invalide", "Veuillez d'abord donner un nom à votre liste.");
    }
  };

  const handleDeleteTaskList = async (id: number) => {
    Confirmation("Supprimer la liste", "Êtes-vous sûr de vouloir supprimer la liste ?", async () => {
      try {
        await deleteTaskList(id);
        await loadMockData();
      } catch (error) {
        Error("Erreur", "Il y a eu un problème lors de la suppression de la liste.", error);
      }
    })
  };

  useFocusEffect(
    useCallback(() => {
      loadMockData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedStatusBar
        style={isModalVisible ? StatusBarStyle.Light : StatusBarStyle.Dark}
      />
      <Text style={styles.title}>To-Do List</Text>
      <FlatList
        data={mockData.toDoLists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: list }) => {
          const completedTasksCount = list.tasks.filter((task) => task.completedDate).length;
          return (
            <ListItem 
              id={list.id} 
              name={list.name} 
              itemName="tâche" 
              totalItems={list.tasks.length}
              completedItems={completedTasksCount} 
              handleDeleteList={async () => handleDeleteTaskList(list.id)} 
              listIcon={"format-list-bulleted"} 
              pathName={"/todolist/[id]"} 
            />
          )
        }}
      />
      <ThemedButton
        title="Ajouter une liste"
        icon="plus"
        onPress={openModal}
        type="primary"
      />
      <AppListModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        listNameInput={toDoListNameInputValue}
        setListNameInput={setToDoListNameInputValue}
        handleAddList={handleAddTaskList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.light.text,
    textAlign: "center",
    fontFamily: "Pacifico",
  }
});