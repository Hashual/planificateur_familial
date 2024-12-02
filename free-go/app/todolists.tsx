import React, { useState, useCallback } from "react";
import {StyleSheet, View, FlatList, Text, ActivityIndicator, Modal, TextInput, Alert, Platform, StatusBar} from "react-native";
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
      <StatusBar
        barStyle={isModalVisible ? 'light-content' : 'dark-content'}
        backgroundColor={isModalVisible ? '#000000' : '#ffffff'}
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
              nbTaskCompleted={completedTasksCount} 
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
        lightColor="#F5C754"
        darkColor="#F5C754"
      />

      <AppListModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        shoppingListNameInputValue={toDoListNameInputValue}
        setShoppingListNameInputValue={setToDoListNameInputValue}
        handleAddShoppingList={handleAddTaskList}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7FAFA",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#141C24",
    textAlign: "center",
    fontFamily: "Pacifico",
  },
  category: {
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingTop: 5,
    borderRadius: 10,
    backgroundColor: "#E3E8F2",
    overflow: "hidden",
  },
  categoryTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#141C24",
  },
  input: {
    borderColor: "#F5C754",
    borderWidth: 1,
    width: "90%",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  shadowElement: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
});

