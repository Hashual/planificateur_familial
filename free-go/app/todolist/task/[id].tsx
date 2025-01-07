import { RootView } from "@/components/utilities/RootView";
import { ThemedText } from "@/components/utilities/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function Task() {
    const params = useLocalSearchParams();
    const taskId = Number(params.id);

    const task = useState<any | undefined>(undefined);


    if (!task) {
        return (
            <RootView color="background" padding={20}>
                <ThemedText>Chargement ou liste introuvable...</ThemedText>
            </RootView>
        );
    }

    return (
        <RootView color="background" padding={20}>
            <ThemedText>Tâche : {taskId}</ThemedText>
        </RootView>
    )
}