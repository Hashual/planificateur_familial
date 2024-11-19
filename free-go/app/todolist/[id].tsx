import TaskItem from "@/components/TaskItem";
import { ThemedButton } from "@/components/ThemedButton";
import {
  addTask,
  deleteTask,
  getMockData,
  updateTask,
} from "@/mockapi/mockData";
import { Task } from "@/mockapi/types";
import { useLocalSearchParams } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  View,
  Text,
  StyleSheet,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ToDoList() {
  const params = useLocalSearchParams();
  const listId = Number(params.id);
  const [toDoData, setToDoData] = useState<{ toDoList: any[] }>({
    toDoList: [],
  });
  const [list, setList] = useState<any | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const loadToDoData = async () => {
    try {
      const data = await getMockData();
      setToDoData(data);
      setList(data.toDoList.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleDeleteTask = async (listId: number, taskId: number) => {
    try {
      const updatedData = await deleteTask(listId, taskId);
      setToDoData(updatedData);
      setList(updatedData.toDoList.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = async (listId: number, newTaskName: string, newDueDate: Date | null) => {
    if (newTaskName.trim()) {
      try {
        const newTask: Task = {
          id: Date.now(),
          name: newTaskName,
          dueDate: newDueDate,
          completedDate: null,
        };
        const updatedData = await addTask(listId, newTask);
        closeModal();
        setToDoData(updatedData);
        setList(updatedData.toDoList.find((list) => list.id === listId));
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleCompleteTask = async (listId: number, taskId: number) => {
    try {
      const taskList = toDoData.toDoList.find((list) => list.id === listId);
      const task = taskList?.tasks.find(
        (task: { id: number }) => task.id === taskId
      );
      if (!task) throw new Error("Task not found");

      const updatedTask = {
        ...task,
        completedDate: task.completedDate ? null : new Date(),
      };
      const updatedData = await updateTask(listId, updatedTask);
      setToDoData(updatedData);
      setList(updatedData.toDoList.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setInputValue("");
    setDate(null);
  };

  useEffect(() => {
    loadToDoData();
  }, []);

  if (!list) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Chargement ou liste introuvable... {listId}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.categoryTitle}>{list.name}</Text>
      <FlatList
        data={list.tasks}
        keyExtractor={(task) => task.id.toString()}
        renderItem={({ item: task }) => (
          <TaskItem
            task={task}
            listId={listId}
            handleDeleteTask={handleDeleteTask}
            handleCompleteTask={handleCompleteTask}
          />
        )}
      />
      <ThemedButton
        title={"Ajouter une tâche"}
        addButton
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
            <Text style={styles.modalTitle}>Ajouter une nouvelle tâche</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de la tâche"
              placeholderTextColor="#666"
              value={inputValue}
              onChangeText={setInputValue}
            />
            { Platform.OS !== "web" && (
                <View style={[styles.input, {flexDirection: "row", justifyContent: "space-between"}]}>
                    {date ? <Text>{date.toLocaleDateString()}</Text> : <Text>Date</Text>}
                    <Pressable onPress={openPicker}>
                        <MaterialCommunityIcons name="calendar" size={20} color="#141C24" />
                    </Pressable>
                </View>
            )}
            
            {showPicker && Platform.OS !== "web" && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            {Platform.OS === "web" && (
              <input
                type="date"
                value={date ? date.toISOString().substring(0, 10) : ""}
                onChange={(e) => setDate(new Date(e.target.value))}
                style={{ marginTop: 10, padding: 5, fontSize: 16 }}
              />
            )}
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
                onPress={() => handleAddTask(listId, inputValue, date)}
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
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#141C24",
  },
  input: {
    width: "85%",
    borderColor: "#F5C754",
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
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
