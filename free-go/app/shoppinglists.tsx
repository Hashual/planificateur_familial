import React, { useState, useCallback } from "react";
import { StyleSheet, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { createShoppingList, deleteShoppingList, getMockData } from "@/mockapi/mockData";
import { MockData } from "@/mockapi/types";

import { ThemedButton } from "@/components/ThemedButton";
import ListItem from "@/components/ListItem";
import AppListModal from "@/components/modals/AddListModal";
import Confirmation from "@/utils/alerts/Confirmation";
import Error from "@/utils/alerts/Error";
import { Colors } from "@/constants/Colors";
import ThemedStatusBar, { StatusBarStyle } from "@/components/utilities/ThemedStatusBar";
import LoadFont from "@/utils/LoadFont";
import { SetBackPage } from "@/utils/SetBackPage";

export default function ShoppingLists() {
  const loadedError = LoadFont({
    "Pacifico": require("@/assets/fonts/Pacifico.ttf"),
  })
  if (loadedError) { return loadedError; }

  SetBackPage('/OpenDoorPage');

  const [mockData, setMockData] = useState<MockData>({ toDoLists: [], shoppingLists: [] });
  const [isModalVisible, setModalVisible] = useState(false);
  const [nameInputValue, setNameInputValue] = useState("");

  const loadMockData = async () => {
    try {
      const data = await getMockData();
      setMockData(data);
    } catch (error) {
      Error("Erreur", "Il y a eu un problème lors du chargement des données.", error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAddShoppingList = async () => {
    const newShoppingListName = nameInputValue.trim();

    if (newShoppingListName) {
      try {
        await createShoppingList(newShoppingListName);
        setNameInputValue("");
        await loadMockData();
        closeModal();
      } catch (error) {
        Error("Erreur", "Il y a eu un problème lors de la création de la liste.", error);
      }
    } else {
      Error("Entrée invalide", "Veuillez d'abord donner un nom à votre liste.");
    }
  };

  const handleDeleteShoppingList = async (id: number) => {
    Confirmation("Supprimer la liste", "Êtes-vous sûr de vouloir supprimer la liste ?", async () => {
      try {
        await deleteShoppingList(id);
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
      <Text style={styles.title}>Listes de courses</Text>
      <FlatList
        data={mockData.shoppingLists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: list }) => {
          const completedTasksCount = list.articles.filter((article) => article.isChecked).length;

          return (
            <ListItem
              id={list.id}
              name={list.name}
              totalItems={list.articles.length}
              completedItems={completedTasksCount}
              handleDeleteList={async () => {
                handleDeleteShoppingList(list.id)
              }}
              itemName={"article"}
              listIcon={"basket-outline"}
              pathName={"/shoppinglist/[id]"} 
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
        listNameInput={nameInputValue}
        setListNameInput={setNameInputValue}
        handleAddList={handleAddShoppingList}
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

