import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { createShoppingList, createTaskList, deleteShoppingList, deleteTaskList, getMockData } from "@/mockapi/mockData";
import { MockData } from "@/mockapi/types";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "@/components/ThemedButton";
import ListItem from "@/components/ListItem";
import { useFocusEffect } from "expo-router";

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
    try {
      if (Platform.OS === "web") {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer la liste ?");
        if (confirmed) {
          await deleteShoppingList(id);
          await loadMockData();
        }
      } else {
        Alert.alert("Supprimer la liste", "Êtes-vous sûr de vouloir supprimer la liste ?", [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              await deleteShoppingList(id);
              await loadMockData();
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la liste de courses :", error);
      Alert.alert("Erreur", "Il y a eu un problème lors de la suppression de la liste.");
    }
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
        addButton={true}
        onPress={openModal}
        type="primary"
        lightColor="#F5C754"
        darkColor="#F5C754"
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une nouvelle liste</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la liste"
              placeholderTextColor="#666"
              value={shoppingListNameInputValue}
              onChangeText={setShoppingListNameInputValue}
            />
            <View style={styles.modalButtons}>
              <ThemedButton
                title="Annuler"
                onPress={closeModal}
                type="secondary"
                lightColor="#F5C754"
                darkColor="#F5C754"
              />
              <ThemedButton
                title="Ajouter"
                onPress={handleAddShoppingList}
                type="primary"
                lightColor="#F5C754"
                darkColor="#F5C754"
              />
            </View>
          </View>
        </View>
      </Modal>
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

