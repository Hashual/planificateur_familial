import React, { useState, useCallback } from "react";
import { StyleSheet, FlatList, Text, ActivityIndicator, Alert, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useFocusEffect } from "expo-router";

import { createShoppingList, deleteShoppingList, getMockData } from "@/mockapi/mockData";
import { MockData } from "@/mockapi/types";

import { ThemedButton } from "@/components/ThemedButton";
import ListItem from "@/components/ListItem";
import AppListModal from "@/components/modals/AddListModal";
import Confirmation from "@/utils/alerts/Confirmation";

export default function ShoppingLists() {
  const [fontsLoaded] = useFonts({
    Pacifico: require("@/assets/fonts/Pacifico.ttf"),
  });

  const [mockData, setMockData] = useState<MockData>({ toDoLists: [], shoppingLists: [] });
  const [isModalVisible, setModalVisible] = useState(false);
  const [shoppingListNameInputValue, setShoppingListNameInputValue] = useState("");

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

  const handleAddShoppingList = async () => {
    const newShoppingListName = shoppingListNameInputValue.trim();

    if (newShoppingListName) {
      try {
        await createShoppingList(newShoppingListName);
        setShoppingListNameInputValue("");
        await loadMockData();
        closeModal();
      } catch (error) {
        console.error(
          "Erreur lors de la création de la liste de courses :",
          error
        );
        Alert.alert(
          "Erreur",
          "Il y a eu un problème lors de la création de la liste."
        );
      }
    } else {
      Alert.alert(
        "Entrée invalide",
        "Veuillez d'abord donner un nom à votre liste."
      );
    }
  };

  const handleDeleteShoppingList = async (id: number) => {
    Confirmation("Supprimer la liste", "Êtes-vous sûr de vouloir supprimer la liste ?", async () => {
      try {
        await deleteShoppingList(id);
        await loadMockData();
      } catch (error) {
        console.error("Erreur lors de la suppression de la liste de courses :", error);
        Alert.alert("Erreur", "Il y a eu un problème lors de la suppression de la liste.");
      }
    })
  };

  useFocusEffect(
    useCallback(() => {
      loadMockData();
    }, [])
  );
  

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isModalVisible ? 'light-content' : 'dark-content'}
        backgroundColor={isModalVisible ? '#000000' : '#ffffff'}
      />
      <Text style={styles.title}>Listes de courses</Text>
      <FlatList
        data={mockData.shoppingLists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: list }) => (
          
          <ListItem id={list.id} name={list.name} totalItems={list.articles.length} handleDeleteList={async () => handleDeleteShoppingList(list.id)} itemName={"article"} listIcon={"basket-outline"} pathName={"/shoppinglist/[id]"} />
        )}
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
        shoppingListNameInputValue={shoppingListNameInputValue}
        setShoppingListNameInputValue={setShoppingListNameInputValue}
        handleAddShoppingList={handleAddShoppingList}
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
  shadowElement: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  }
});

