import TaskItem from "@/components/todolist/TaskItem";
import { ThemedButton } from "@/components/ThemedButton";
import {
  addTask,
  deleteTask,
  getMockData,
  updateTask,
} from "@/mockapi/mockData";
import { Task } from "@/mockapi/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  View,
  Text,
  StyleSheet,
  Modal,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ToDoList() {
  const params = useLocalSearchParams();
  const listId = Number(params.id);
  const [toDoData, setToDoData] = useState<{ toDoLists: any[] }>({
    toDoLists: [],
  });
  const [list, setList] = useState<any | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskNameInput, settaskNameInput] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const showTimePicker = () => {
    if (!selectedDate) {
      Alert.alert("Attention", "Veuillez d'abord sélectionner une date.");
      return;
    }
    setTimePickerVisible(true);
  };
  const hideTimePicker = () => setTimePickerVisible(false);

  const loadToDoData = async () => {
    try {
      const data = await getMockData();
      setToDoData(data);
      setList(data.toDoLists.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleDeleteTask = async (listId: number, taskId: number) => {
    try {
      const updatedData = await deleteTask(listId, taskId);
      setToDoData(updatedData);
      setList(updatedData.toDoLists.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const createDate = () => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      if (selectedTime) {
        date.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      } else {
        date.setHours(0, 0, 0, 0);
      }
      return date;
    } else {
      return null;
    }
  };

  const handleAddTask = async (listId: number, newTaskName: string) => {
    if (newTaskName.trim()) {
      try {
        const newTask: Task = {
          id: Date.now(),
          name: newTaskName,
          dueDate: createDate(),
          completedDate: null,
        };
        const updatedData = await addTask(listId, newTask);
        closeModal();
        setToDoData(updatedData);
        setList(updatedData.toDoLists.find((list) => list.id === listId));
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleCompleteTask = async (listId: number, taskId: number) => {
    try {
      const taskList = toDoData.toDoLists.find((list) => list.id === listId);
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
      setList(updatedData.toDoLists.find((list) => list.id === listId));
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleTimeConfirm = (time: Date) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    settaskNameInput("");
    setSelectedDate(null);
    setSelectedTime(null);
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
              placeholder="Nom de la tâche *"
              placeholderTextColor="#666"
              value={taskNameInput}
              onChangeText={settaskNameInput}
            />
            {Platform.OS === "web" ? (
              <>
                <input
                  type="date"
                  style={styles.input}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
                <input
                    type="time"
                    style={styles.input}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":");
                      const time = new Date();
                      time.setHours(Number(hours), Number(minutes));
                      setSelectedTime(time);
                    }}
                  />
                </>
            ) : (
              <>
              <View style={[styles.input, {flexDirection: "row", justifyContent: "space-between"}]}>
                  {selectedDate ? <Text>{selectedDate.toLocaleDateString()}</Text> : <Text style={{color: "#666"}}>Date</Text>}
                  <Pressable onPress={showDatePicker}>
                      <MaterialCommunityIcons name="calendar-edit" size={20} color="#141C24" />
                  </Pressable>
              </View>
              <View style={[styles.input, {flexDirection: "row", justifyContent: "space-between"}]}>
                  {selectedTime ? <Text>{selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}</Text> : <Text style={{color: "#666"}}>Heure</Text>}
                  <Pressable onPress={showTimePicker}>
                      <MaterialCommunityIcons name="clock-edit-outline" size={20} color="#141C24" />
                  </Pressable>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                cancelTextIOS={"Annuler"}
                confirmTextIOS={"Confirmer"}
                locale="fr"
              />
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={hideTimePicker}
                cancelTextIOS={"Annuler"}
                confirmTextIOS={"Confirmer"}
                locale="fr"
              />
              </>
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
                onPress={() => handleAddTask(listId, taskNameInput)}
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
    boxSizing: "border-box" as "border-box",
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
