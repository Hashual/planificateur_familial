import * as FileSystem from "expo-file-system";
import { MockData, Task } from "@/mockapi/types";

const mockDataPath = FileSystem.documentDirectory + "mockData.json";

const initialData: MockData = require("../data/mockData.json") as MockData

const ensureFileExists = async () => {
  try {
    const fileExists = await FileSystem.getInfoAsync(mockDataPath);
    if (!fileExists.exists) {
      console.log("Fichier introuvable, création en cours...");
      await FileSystem.writeAsStringAsync(
        mockDataPath,
        JSON.stringify(initialData, null, 2)
      );
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'existence du fichier:", error);
  }
};

export const getMockData = async (): Promise<MockData> => {
  await ensureFileExists();
  const data = await FileSystem.readAsStringAsync(mockDataPath);
  try {
    const parsedData = JSON.parse(data);
    if (parsedData && parsedData.toDoList) {
      return parsedData as MockData;
    } else {
      console.error("Les données lues ne sont pas au bon format:", parsedData);
      return { toDoList: [] };
    }
  } catch (error) {
    console.error("Erreur lors du parsing JSON:", error);
    return { toDoList: [] };
  }
};


const saveMockData = async (data: MockData): Promise<void> => {
  await FileSystem.writeAsStringAsync(
    mockDataPath,
    JSON.stringify(data, null, 2)
  );
};

export const addTask = async (listId: number, newTask: Task): Promise<MockData> => {
  const data = await getMockData();
  const taskList = data.toDoList.find((list) => list.id === listId);

  if (!taskList) throw new Error("List not found");

  taskList.tasks.push(newTask);
  await saveMockData(data);
  return data;
};

export const deleteTask = async (listId: number, taskId: number): Promise<MockData> => {
  const data = await getMockData();
  const taskList = data.toDoList.find((list) => list.id === listId);

  if (!taskList) throw new Error("List not found"); 

  taskList.tasks = taskList.tasks.filter((task) => task.id !== taskId);
  await saveMockData(data);
  return data;
};

