import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { createTaskList, getMockData } from "@/mockapi/mockData";
import { MockData } from "@/mockapi/types";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "@/components/ThemedButton";
import ListItem from "@/components/ListItem";

export default function ToDoLists() {
  const [fontsLoaded] = useFonts({
    Pacifico: require("@/assets/fonts/Pacifico.ttf"),
  });

  const [toDoData, setToDoData] = useState<MockData>({ toDoList: [] });
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const loadToDoData = async () => {
    try {
      const data = await getMockData();
      setToDoData(data);
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
    const newTaskListName = inputValue.trim();

    if (newTaskListName) {
      try {
        await createTaskList(newTaskListName);
        setInputValue("");
        await loadToDoData();
        closeModal();
      } catch (error) {
        console.error(
          "Erreur lors de la création de la liste de tâches :",
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
        "Le nom de la liste ne peut pas être vide."
      );
    }
  };

  useEffect(() => {
    loadToDoData();
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <FlatList
        data={toDoData.toDoList}
        style={{ overflow: "visible" }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: list }) => (
          <ListItem id={list.id} name={list.name} />
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
              value={inputValue}
              onChangeText={setInputValue}
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
                onPress={handleAddTaskList}
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
