import React, { useState, useCallback } from "react";
import { Button, FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { ThemedButton } from "@/components/utilities/ThemedButton";
import ListItem from "@/components/ListItem";
import Error from "@/utils/alerts/Error";
import Confirmation from "@/utils/alerts/Confirmation";
import AppListModal from "@/components/modals/AddListModal";
import { SetBackPage } from "@/utils/SetBackPage";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import { RootView } from "@/components/utilities/RootView";
import {API, useFetchQuery} from "@/hooks/useAPI";
import Header from "@/components/Header";

export default function ToDoLists() {
  SetBackPage('./homePage/OpenDoorPage');

  const [data, setData] = useState<API["/todo-list"]>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [toDoListNameInputValue, setToDoListNameInputValue] = useState("");


  const loadData = async () => {
    try {
      const data = await useFetchQuery<API['/todo-list']>("/todo-list", { method: "GET" });
      setData(data.data);
    } catch (error) {
        console.error("Error loading data:", error);
    }
  }

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
        await useFetchQuery("/todo-list", {
          method: "POST",
          body: {title: newTaskListName}
        });
        setToDoListNameInputValue("");
        await loadData();
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
        await useFetchQuery(`/todo-list/${id}`, {method: "DELETE"});
        await loadData();
      } catch (error) {
        Error("Erreur", "Il y a eu un problème lors de la suppression de la liste.", error);
      }
    })
  };

  useFocusEffect(
    useCallback(() => {
        loadData();
    }, [])
  );

  return (
    <RootView color="background" padding={20}>
      <ThemedStatusBar isDark={isModalVisible} />
      <Header title={"Mes To-Do List"} />
      

      <FlatList
        data={Array.isArray(data) ? data : []}
        renderItem={({item: list}) => {
          const completedTasksCount = list.tasksAmount - list.tasksInProgressAmount;
          return (
              <ListItem
                  id={list.id}
                  name={list.title}
                  itemName="tâche"
                  totalItems={list.tasksAmount}
                  completedItems={completedTasksCount}
                  handleDeleteList={async () => handleDeleteTaskList(list.id)}
                  listIcon={"format-list-bulleted"}
                  pathName={"/todolist/[id]"}/>
          );
        }}/>
      
      <ThemedButton
        title="Ajouter une liste"
        icon="plus"
        onPress={openModal}
        type="primary"/>

      <AppListModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        listNameInput={toDoListNameInputValue}
        setListNameInput={setToDoListNameInputValue}
        handleAddList={handleAddTaskList}/>
    </RootView>
    );
}
