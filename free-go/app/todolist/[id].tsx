import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList } from "react-native";

import {Task} from "@/mockapi/types";

import TaskItem from "@/components/todolist/TaskItem";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import ThemedStatusBar from "@/components/utilities/ThemedStatusBar";
import Error from "@/utils/alerts/Error";
import { SetBackPage } from "@/utils/SetBackPage";
import { RootView } from "@/components/utilities/RootView";
import {useFetchQuery} from "@/hooks/useAPI";
import { ActionSheetProvider, connectActionSheet } from "@expo/react-native-action-sheet";
import Header from "@/components/Header";
import WaitingScreen from "@/components/utilities/WaitingScreen";
import TaskModal from "@/components/modals/TaskModal";
import { createDate } from "@/utils/dateFunctions";
import { sortTask } from "@/utils/sortFunctions";
import DropdownButton from "@/components/utilities/DropdownButton";
import DropdownMenu from "@/components/utilities/DropdownButton";

const ToDoList = ({ showActionSheetWithOptions } : any) => {
  SetBackPage("/todolists");

  const params = useLocalSearchParams();
  const listId = Number(params.id);
  const [list, setList] = useState<any | undefined>(undefined);
  const [isNewTask, setIsNewTask] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskNameInput, setTaskNameInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState(-1);
  const [sortOrder, setSortOrder] = useState('asc');
  const options = [
    { label: 'Date de création', value: 'createdAt' },
    { label: 'Nom', value: 'title' },
    { label: 'Date d\'échéance', value: 'dueDate' },
  ];
  
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

  const handleAddTask = async () => {
    const dueDate = createDate(selectedDate, selectedTime);
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

  const handleModifyTask = async (taskId: number) => {
    const dueDate = createDate(selectedDate, selectedTime);
      if (!taskNameInput.trim()) {
          Error("Entrée invalide", "Veuillez d'abord donner un nom à votre tâche.");
          return;
      }
  
      if(dueDate && dueDate < new Date()) {
          Error("Entrée invalide", "Veuillez ne pas choisir une date passée.");
          return;
      }
      try {
            const task = list?.tasks.find(
              (task: { id: number }) => task.id === taskId
            );

            const updatedTask: Task = {
              id: taskId,
              title: taskNameInput,
              dueDate: dueDate,
              completedDate: task.completedDate,
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
            closeModal();
          } catch (error) {
            Error("Erreur", "Erreur lors de l'ajout de la tâche", error);
          }
  }

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

  const openModal = (isNewTask: boolean, taskTitle?: string, taskDueDate?: Date |null) => {
    setIsNewTask(isNewTask);
    if (!isNewTask && taskTitle) {
      setTaskNameInput(taskTitle);
      if(taskDueDate) {
          setSelectedDate(new Date(taskDueDate));
          setSelectedTime(new Date(taskDueDate));
      } else {
          setSelectedDate(null);
          setSelectedTime(null);
      }
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTaskNameInput("");
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const showActionSheet = (taskId: number, taskTitle: string, taskDueDate?: Date | null) => {
    const options = ['Annuler', 'Détails', 'Modifier', 'Supprimer'];
    const destructiveButtonIndex = 3;
    const modifyButtonIndex = 2;
    const detailButtonIndex = 1;
    const cancelButtonIndex = 0;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex: number | void) => {
      switch (selectedIndex) {
        case detailButtonIndex:
          router.push(`/todolist/task/${taskId}?listId=${listId}`);
          break;
        case modifyButtonIndex:
          setCurrentTaskId(taskId);
          openModal(false, taskTitle, taskDueDate);
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

  const handleOptionSelect = (value: string) => {
    
    setList((prevList: any) => ({
      ...prevList,
      tasks: sortTask(list.tasks, value as keyof Task, "asc")
    }));
  };

  if (!list) {
    return (
      <WaitingScreen />
    );
  }

  return (
    <RootView color="background" padding={20}>
      <ThemedStatusBar isDark={isModalVisible} />
      <Header title={list.title} Component={() => (
        <DropdownMenu options={options} onSelectOption={handleOptionSelect} />
      )} />
      <FlatList
        data={list.tasks}
        keyExtractor={(task) => task.id.toString()}
        renderItem={({ item: task }) => (
          <TaskItem
            task={task}
            handleCompleteTask={() => handleCompleteTask(task.id)}
            handleTaskMenu={() => showActionSheet(task.id, task.title, task.dueDate)}
          />
        )}
      />
      <ThemedButton
        title={"Ajouter une tâche"}
        icon="plus"
        onPress={() => openModal(true)}
        type="primary"
      />

      <TaskModal 
        isNewTask={isNewTask}
        isModalVisible={isModalVisible} 
        closeModal={closeModal} 
        taskNameInput={taskNameInput} 
        setTaskNameInput={setTaskNameInput} 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        selectedTime={selectedTime} 
        setSelectedTime={setSelectedTime} 
        handleTask={isNewTask ? handleAddTask : () => handleModifyTask(currentTaskId)} />
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

