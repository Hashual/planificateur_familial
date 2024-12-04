import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";

import { addTask, deleteTask, getMockData, updateTask} from "@/mockapi/mockData";
import { Task } from "@/mockapi/types";

import TaskItem from "@/components/todolist/TaskItem";
import { ThemedButton } from "@/components/ThemedButton";
import LoadFont from "@/utils/LoadFont";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import Error from "@/utils/alerts/Error";
import AddTaskModal from "@/components/modals/AddTaskModal";
import { ThemedText } from "@/components/ThemedText";
import { RootView } from "@/components/RootView";

export default function ToDoList() {
  const loadedError = LoadFont({
    "Pacifico": require("@/assets/fonts/Pacifico.ttf"),
  })
  if (loadedError) { return loadedError; }

  const params = useLocalSearchParams();
  const listId = Number(params.id);
  const [toDoData, setToDoData] = useState<{ toDoLists: any[] }>({
    toDoLists: [],
  });
  const [list, setList] = useState<any | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskNameInput, setTaskNameInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  
  const loadToDoData = async () => {
    try {
      const data = await getMockData();
      setToDoData(data);
      setList(data.toDoLists.find((list) => list.id === listId));
    } catch (error) {
      Error("Erreur", "Erreur de chargement des données", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const updatedData = await deleteTask(listId, taskId);
      setToDoData(updatedData);
      setList(updatedData.toDoLists.find((list) => list.id === listId));
    } catch (error) {
      Error("Erreur", "Erreur lors de la suppression de la tâche", error);
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

  const handleAddTask = async () => {
    if (!taskNameInput.trim()) {
      Error("Entrée invalide", "Veuillez d'abord donner un nom à votre tâche.");
      return;
    }

    try {
      const newTask: Task = {
        id: Date.now(),
        name: taskNameInput,
        dueDate: createDate(),
        completedDate: null,
      };
      const updatedData = await addTask(listId, newTask);
      closeModal();
      setToDoData(updatedData);
      setList(updatedData.toDoLists.find((list) => list.id === listId));
    } catch (error) {
      Error("Erreur", "Erreur lors de l'ajout de la tâche", error);
    }

  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      const taskList = toDoData.toDoLists.find((list) => list.id === listId);
      const task = taskList?.tasks.find(
        (task: { id: number }) => task.id === taskId
      );
      if (!task) {
        Error("Erreur", "La tâche n'existe pas ou n'est pas trouvée");
        return;
      }

      const updatedTask = {
        ...task,
        completedDate: task.completedDate ? null : new Date(),
      };
      const updatedData = await updateTask(listId, updatedTask);
      setToDoData(updatedData);
      setList(updatedData.toDoLists.find((list) => list.id === listId));
    } catch (error) {
      Error("Erreur", "Erreur lors de la complétion d'une tâche", error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTaskNameInput("");
    setSelectedDate(null);
    setSelectedTime(null);
  };

  useFocusEffect(
    useCallback(() => {
      loadToDoData();
    }, [])
  );

  if (!list) {
    return (
      <RootView color="background" padding={20}>
        <ThemedText>Chargement ou liste introuvable... {listId}</ThemedText>
      </RootView>
    );
  }

  return (
    <RootView color="background" padding={20}>
      <ThemedStatusBar isDark={isModalVisible} />
      <ThemedText variant="title" color="primaryText">{list.name}</ThemedText>
      <FlatList
        data={list.tasks}
        keyExtractor={(task) => task.id.toString()}
        renderItem={({ item: task }) => (
          <TaskItem
            task={task}
            listId={listId}
            handleDeleteTask={handleDeleteTask}
            handleCompleteTask={() => handleCompleteTask(task.id)}
          />
        )}
      />
      <ThemedButton
        title={"Ajouter une tâche"}
        icon="plus"
        onPress={openModal}
        type="primary"
      />

      <AddTaskModal 
        isModalVisible={isModalVisible} 
        closeModal={closeModal} 
        taskNameInput={taskNameInput} 
        setTaskNameInput={setTaskNameInput} 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        selectedTime={selectedTime} 
        setSelectedTime={setSelectedTime} 
        handleAddTask={handleAddTask} />
    </RootView>
  );
}