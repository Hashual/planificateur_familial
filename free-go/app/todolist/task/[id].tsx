import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Header from "@/components/Header";
import { RootView } from "@/components/utilities/RootView";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { ThemedText } from "@/components/utilities/ThemedText";
import WaitingScreen from "@/components/utilities/WaitingScreen";
import TaskModal from "@/components/modals/TaskModal";
import IconInSquare from "@/components/utilities/IconInSquare";
import { useFetchQuery } from "@/hooks/useAPI";
import Error from "@/utils/alerts/Error";
import { SetBackPage } from "@/utils/SetBackPage";

import { Task } from "@/mockapi/types";
import { createDate, formatDateTimeToFrench } from "@/utils/dateFunctions";


export default function TaskDetails() {
    const params = useLocalSearchParams();
    const taskId = Number(params.id);
    const listId = Number(params.listId);
    const [isModalVisible, setModalVisible] = useState(false);
    const [taskNameInput, setTaskNameInput] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    SetBackPage(`./todolist/${listId}`);

    const [task, setTask] = useState<any | undefined>(undefined);

    const loadTaskData = async () => {
        try {
            const taskData = await useFetchQuery(
                "/todo-list/" + listId + "/tasks/" + taskId,
                { method: "GET" }
            );
            setTask(taskData.data);
        } catch (error) {
            Error("Erreur", "Erreur de chargement des données", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTaskData();
        }, [])
    );

    const openModal = () => {
        setModalVisible(true);
        setTaskNameInput(task.title);
        if(task.dueDate) {
            setSelectedDate(new Date(task.dueDate));
            setSelectedTime(new Date(task.dueDate));
        } else {
            setSelectedDate(null);
            setSelectedTime(null);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const modifyTask = async () => {
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
                id: task.id,
                title: taskNameInput,
                dueDate: dueDate,
                completedDate: task.completedDate,
              };

              const updatedTasks = await useFetchQuery<{ data: Task[] }>("/todo-list/" + listId + "/tasks/" + task.id , { method: "PUT", body: newTask });
              let updatedTask = Array.isArray(updatedTasks.data) ? updatedTasks.data.find((t) => t.id === task.id) : undefined;
              setTask(updatedTask);
              closeModal();
            } catch (error) {
              Error("Erreur", "Erreur lors de l'ajout de la tâche", error);
            }
    }

    if (!task) {
        return <WaitingScreen />;
    }

    const createdAt = formatDateTimeToFrench(task.createdAt);
    const updatedAt = formatDateTimeToFrench(task.updatedAt);
    const dueDate = task.dueDate
        ? formatDateTimeToFrench(task.dueDate)
        : null;
    const completedDate = task.completedDate
        ? formatDateTimeToFrench(task.completedDate)
        : null;

    const InfoWithLogo = (text: string, logo: keyof typeof MaterialCommunityIcons.glyphMap) => {
        return (
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 15}}>
                <IconInSquare listIcon={logo} size={40} />
                <ThemedText>{text}</ThemedText>
            </View>
        )
    }

    return (
        <RootView color="background" padding={20}>
            <Header title={task.title} />
            <View style={{ flex: 1 }}>
                {InfoWithLogo(`Créée le ${createdAt}`, "calendar")}
                {InfoWithLogo(`Dernière mise à jour le ${updatedAt}`, "pencil-outline")}
                {InfoWithLogo(dueDate ? `Date d'échéance : ${dueDate}` : "Aucune date d'échéance", "clock-outline")}
                {completedDate ? InfoWithLogo(`Terminée le ${completedDate}`, "check") : InfoWithLogo(`Non terminée`, "close")}
            </View>
            <ThemedButton
                title={"Modifier la tâche"}
                icon="pencil-outline"
                onPress={openModal}
                type="primary"
            />
            <TaskModal
                isNewTask={false}
                isModalVisible={isModalVisible}
                closeModal={closeModal}
                taskNameInput={taskNameInput}
                setTaskNameInput={setTaskNameInput}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                handleTask={modifyTask}
            />
        </RootView>
    );
}
