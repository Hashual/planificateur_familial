import Header from "@/components/Header";
import { RootView } from "@/components/utilities/RootView";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { ThemedText } from "@/components/utilities/ThemedText";
import { useFetchQuery } from "@/hooks/useAPI";
import { useThemeColor } from "@/hooks/useThemeColor";
import Error from "@/utils/alerts/Error";
import { SetBackPage } from "@/utils/SetBackPage";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

export default function Task() {
    const params = useLocalSearchParams();
    const colors = useThemeColor();
    const taskId = Number(params.id);
    const listId = Number(params.listId);
    SetBackPage(`./todolist/${listId}`);

    const [task, setTask] = useState<any | undefined>(undefined);

    const loadTaskData = async () => {
        try {
            const taskData = await useFetchQuery("/todo-list/" + listId + "/tasks/" + taskId, { method: "GET" });
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


    if (!task) {
        return (
            <RootView color="background" padding={20} style={{flex:1, justifyContent: "center", alignItems:"center"}}>
                <ActivityIndicator size="large" color={colors.primary} />
                <ThemedText style={{marginTop: 20}}>Chargement ou liste introuvable...</ThemedText>
            </RootView>
        );
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Non définie';
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      };

    const createdAt = formatDate(task.createdAt);
    const updatedAt = formatDate(task.updatedAt);
    const dueDate = task.dueDate ? formatDate(task.dueDate) : 'Pas de date limite';
    const completedDate = task.completedDate ? formatDate(task.completedDate) : 'Non terminée';

    return (
        <RootView color="background" padding={20}>
            <Header title={task.title} />
            <View style={{flex: 1}}>
                <ThemedText style={styles.text}>Créée le : {createdAt}</ThemedText>
                <ThemedText style={styles.text}>Dernière mise à jour : {updatedAt}</ThemedText>
                <ThemedText style={styles.text}>Date limite : {dueDate}</ThemedText>
                <ThemedText>Complétée le : {completedDate}</ThemedText>
            </View>
            <ThemedButton
                title={"Modifier la tâche"}
                icon="pencil-outline"
                onPress={() => {}}
                type="primary"
            />
        </RootView>
    )
}

const styles = StyleSheet.create({
    text: {
        marginBottom: 15
    }
})