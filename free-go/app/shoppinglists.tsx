import React, { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { useFocusEffect } from "expo-router";

import { createShoppingList, deleteShoppingList, getMockData } from "@/mockapi/mockData";
import { MockData } from "@/mockapi/types";

import { ThemedButton } from "@/components/ThemedButton";
import ListItem from "@/components/ListItem";
import AppListModal from "@/components/modals/AddListModal";
import Confirmation from "@/utils/alerts/Confirmation";
import Error from "@/utils/alerts/Error";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import LoadFont from "@/utils/LoadFont";
import { ThemedText } from "@/components/ThemedText";
import { RootView } from "@/components/RootView";

export default function ShoppingLists() {
  const loadedError = LoadFont({
    "Pacifico": require("@/assets/fonts/Pacifico.ttf"),
  })
  if (loadedError) { return loadedError; }

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
    <RootView color="background" padding={20}>
      <ThemedStatusBar isDark={isModalVisible} />
      <ThemedText variant="title" color="primaryText" align="center">Mes listes de courses</ThemedText>
      
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
    </RootView>
  );
}

