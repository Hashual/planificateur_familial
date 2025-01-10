import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";

import {Task} from "@/mockapi/types";

import TaskItem from "@/components/todolist/TaskItem";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import Error from "@/utils/alerts/Error";
import AddTaskModal from "@/components/modals/AddTaskModal";
import { SetBackPage } from "@/utils/SetBackPage";
import { ThemedText } from "@/components/utilities/ThemedText";
import { RootView } from "@/components/utilities/RootView";
import {useFetchQuery} from "@/hooks/useAPI";
import { ActionSheetProvider, connectActionSheet } from "@expo/react-native-action-sheet";
import Header from "@/components/Header";
import WaitingScreen from "@/components/utilities/WaitingScreen";

const ToDoList = ({ showActionSheetWithOptions } : any) => {
  SetBackPage("/todolists");

  const params = useLocalSearchParams();
  const listId = Number(params.id);
  const [list, setList] = useState<any | undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskNameInput, setTaskNameInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  
  const loadToDoData = async () => {
    try {
        const taskData = await useFetchQuery("/todo-list/" + listId, { method: "GET" })
        setList(taskData.data);
    } catch (error) {
      Error("Erreur", "Erreur de chargement des données", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const updatedData =  await useFetchQuery("/todo-list/" + listId + "/tasks/" + taskId, { method: "DELETE"});
      if (updatedData) {
        setList((prevList: any) => ({
          ...prevList,
          tasks: updatedData.data
        }));
      } else {
        Error("Erreur", "Erreur lors de la mise à jour de la tâche");
      }

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
    const dueDate = createDate();
    if (!taskNameInput.trim()) {
      Error("Entrée invalide", "Veuillez d'abord donner un nom à votre tâche.");
      return;
    }

    if(dueDate && dueDate < new Date()) {
      Error("Entrée invalide", "Veuillez ne pas choisir une date passée.");
      return;
    }

    try {
      const newTask: Task = {
        id: -1,
        title: taskNameInput,
        dueDate: dueDate,
        completedDate: null,
      };
      const updatedData= await useFetchQuery("/todo-list/" + listId + "/tasks/" , { method: "POST", body: newTask });
      closeModal();
      setList((prevList: any) => ({
        ...prevList,
        tasks: updatedData.data
      }));
    } catch (error) {
      Error("Erreur", "Erreur lors de l'ajout de la tâche", error);
    }

  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      const task = list?.tasks.find(
        (task: { id: number }) => task.id === taskId
      );
      if (!task) {
        Error("Erreur", "La tâche n'existe pas ou n'est pas trouvée");
        return;
      }

      const updatedTask = {
        title: task.title,
        id: task.id,
        dueDate: task.dueDate,
        isComplete: task.completedDate ? 0 : 1,
        completedDate: task.completedDate ? null : new Date(),
      };

      const updatedData =  await useFetchQuery("/todo-list/" + listId + "/tasks/" + taskId, { method: "PUT", body: updatedTask });

      if (updatedData) {
        setList((prevList: any) => ({
          ...prevList,
          tasks: prevList.tasks.map((t: any) =>
              t.id === taskId ? { ...t, ...updatedTask } : t
          ),
        }));
      } else {
        Error("Erreur", "Erreur lors de la mise à jour de la tâche");
      }
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

  const onPress = (taskId: number) => {
    const options = ['Annuler', 'Détails', 'Supprimer'];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 0;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex: number | void) => {
      switch (selectedIndex) {
        case 1:
          router.push(`/todolist/task/${taskId}?listId=${listId}`);
          break;
        case destructiveButtonIndex:
          handleDeleteTask(taskId);
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }

  useFocusEffect(
    useCallback(() => {
      loadToDoData();
    }, [])
  );

  if (!list) {
    return (
      <WaitingScreen />
    );
  }

  return (
    <RootView color="background" padding={20}>
      <ThemedStatusBar isDark={isModalVisible} />
      <Header title={list.title} />
      <FlatList
        data={list.tasks}
        keyExtractor={(task) => task.id.toString()}
        renderItem={({ item: task }) => (
          <TaskItem
            task={task}
            handleCompleteTask={() => handleCompleteTask(task.id)}
            handleTaskMenu={() => onPress(task.id)}
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


const ConnectedToDoList = connectActionSheet(ToDoList);

export default function WrappedToDoList() {
  return (
    <ActionSheetProvider>
      <ConnectedToDoList />
    </ActionSheetProvider>
  )
}

