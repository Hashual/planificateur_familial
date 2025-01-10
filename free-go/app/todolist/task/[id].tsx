import Header from "@/components/Header";
import ModifyTaskModal from "@/components/modals/ModifyTaskModal";
import { RootView } from "@/components/utilities/RootView";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { ThemedText } from "@/components/utilities/ThemedText";
import WaitingScreen from "@/components/utilities/WaitingScreen";
import { useFetchQuery } from "@/hooks/useAPI";
import { useThemeColor } from "@/hooks/useThemeColor";
import Error from "@/utils/alerts/Error";
import { SetBackPage } from "@/utils/SetBackPage";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Task } from "@/mockapi/types";

export default function TaskDetails() {
    const params = useLocalSearchParams();
    const colors = useThemeColor();
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

    const closeModal = () => {
        setModalVisible(false);
    };

    const modifyTask = async () => {
        try {
              const newTask: Task = {
                id: task.id,
                title: taskNameInput,
                dueDate: createDate(),
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

    const formatDate = (dateString: string) => {
        if (!dateString) return "Non définie";
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}/${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}/${date.getFullYear()} à ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
    };

    const createdAt = formatDate(task.createdAt);
    const updatedAt = formatDate(task.updatedAt);
    const dueDate = task.dueDate
        ? formatDate(task.dueDate)
        : "Pas de date limite";
    const completedDate = task.completedDate
        ? formatDate(task.completedDate)
        : "Non terminée";

    return (
        <RootView color="background" padding={20}>
            <Header title={task.title} />
            <View style={{ flex: 1 }}>
                <ThemedText style={styles.text}>
                    Créée le : {createdAt}
                </ThemedText>
                <ThemedText style={styles.text}>
                    Dernière mise à jour : {updatedAt}
                </ThemedText>
                <ThemedText style={styles.text}>
                    Date limite : {dueDate}
                </ThemedText>
                <ThemedText>Complétée le : {completedDate}</ThemedText>
            </View>
            <ThemedButton
                title={"Modifier la tâche"}
                icon="pencil-outline"
                onPress={openModal}
                type="primary"
            />
            <ModifyTaskModal
                isModalVisible={isModalVisible}
                closeModal={closeModal}
                taskNameInput={taskNameInput}
                setTaskNameInput={setTaskNameInput}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                handleModifyTask={modifyTask}
            />
        </RootView>
    );
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 15,
    },
});
