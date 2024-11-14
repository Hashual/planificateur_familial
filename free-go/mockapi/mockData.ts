import * as FileSystem from "expo-file-system";
import { MockData, Task } from "@/mockapi/types";

const mockDataPath = `${FileSystem.documentDirectory}mockData.json`; // Pas sur du chemin

const initialData: MockData = {
  toDoList: [],
};

const ensureFileExists = async () => {
  const fileExists = await FileSystem.getInfoAsync(mockDataPath);
  if (!fileExists.exists) {
    await FileSystem.writeAsStringAsync(
      mockDataPath,
      JSON.stringify(initialData, null, 2)
    );
  }
};

export const getMockData = async (): Promise<MockData> => {
  await ensureFileExists();
  const data = await FileSystem.readAsStringAsync(mockDataPath);
  return JSON.parse(data) as MockData;
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
