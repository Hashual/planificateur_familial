import TaskItem from "@/components/TaskItem";
import { addTask, deleteTask, getMockData, updateTask } from "@/mockapi/mockData";
import { Task } from "@/mockapi/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, TextInput, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ToDoList() {
    const params = useLocalSearchParams();
    const listId = Number(params.id);
    const [toDoData, setToDoData] = useState<{ toDoList: any[] }>({ toDoList: [] });
    const [list, setList] = useState<any | undefined>(undefined);

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

    const handleAddTask = async (listId: number, newTaskName: string) => {
        if (newTaskName.trim()) {
            try {
                const newTask: Task = {
                    id: Date.now(),
                    name: newTaskName,
                    dueDate: null,
                    completedDate: null,
                };
                const updatedData = await addTask(listId, newTask);
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
            const task = taskList?.tasks.find((task: { id: number; }) => task.id === taskId);
            if (!task) throw new Error("Task not found");

            const updatedTask = { ...task, completedDate: task.completedDate ? null : new Date() };
            const updatedData = await updateTask(listId, updatedTask);
            setToDoData(updatedData);
            setList(updatedData.toDoList.find((list) => list.id === listId));
        } catch (error) {
            console.error("Error completing task:", error);
        }
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
            <TextInput
                style={styles.input}
                placeholder={`Ajouter une tâche à ${list.name}...`}
                onSubmitEditing={(e) => handleAddTask(listId, e.nativeEvent.text)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F7FAFA',
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#141C24',
    },
    input: {
        borderColor: '#00796b',
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
});
