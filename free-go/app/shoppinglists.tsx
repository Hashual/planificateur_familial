import React, { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { useFocusEffect } from "expo-router";

import { ThemedButton } from "@/components/utilities/ThemedButton";
import ListItem from "@/components/ListItem";
import AppListModal from "@/components/modals/AddListModal";
import Confirmation from "@/utils/alerts/Confirmation";
import Error from "@/utils/alerts/Error";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import LoadFont from "@/utils/LoadFont";
import { SetBackPage } from "@/utils/SetBackPage";
import { ThemedText } from "@/components/utilities/ThemedText";
import { RootView } from "@/components/utilities/RootView";
import {API, useFetchQuery} from "@/hooks/useAPI";

export default function ShoppingLists() {
  const loadedError = LoadFont({
    "Pacifico": require("@/assets/fonts/Pacifico.ttf"),
  })
  if (loadedError) { return loadedError; }

  SetBackPage('./homePage/OpenDoorPage');

  const [data, setData] = useState<API["/shopping-list"]>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [nameInputValue, setNameInputValue] = useState("");

  const loadData = async () => {
    try {
      const data = await useFetchQuery<API['/shopping-list']>("/shopping-list");
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

  const handleAddShoppingList = async () => {
    const newShoppingListName = nameInputValue.trim();

    if (newShoppingListName) {
      try {
        await useFetchQuery("/shopping-list", {
          method: "POST",
          body: {
            title: newShoppingListName
          }
        });
        setNameInputValue("");
        await loadData();
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
        await useFetchQuery(`/shopping-list/${id}`, {method: "DELETE"});
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
      <ThemedText variant="title" color="primaryText" align="center">Mes listes de courses</ThemedText>
      
      <FlatList
        data={data}
        renderItem={({ item: list }) => {
          const completedTasksCount = list.numberOfArticles - list.numberOfInProgressArticles;
          return (
            <ListItem
              id={list.id}
              name={list.title}
              totalItems={list.numberOfArticles}
              completedItems={completedTasksCount}
              handleDeleteList={async () => {
                await handleDeleteShoppingList(list.id)
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

