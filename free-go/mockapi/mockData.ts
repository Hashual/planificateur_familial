import * as FileSystem from 'expo-file-system';
import { MockData, Task } from '@/mockapi/types';

const mockDataPath = `${FileSystem.documentDirectory}mockData.json`;

const initialData: MockData = {
  toDoList: []
};

const ensureFileExists = async () => {
  const fileExists = await FileSystem.getInfoAsync(mockDataPath);
  if (!fileExists.exists) {
    await FileSystem.writeAsStringAsync(mockDataPath, JSON.stringify(initialData, null, 2));
  }
};

export const getMockData = async (): Promise<MockData> => {
  await ensureFileExists();
  const data = await FileSystem.readAsStringAsync(mockDataPath);
  return JSON.parse(data) as MockData;
};

const saveMockData = async (data: MockData): Promise<void> => {
  await FileSystem.writeAsStringAsync(mockDataPath, JSON.stringify(data, null, 2));
};

export const addTask = async (categoryId: number, newTask: Task): Promise<MockData> => {
  const data = await getMockData();
  const category = data.toDoList.find((cat) => cat.id === categoryId);

  if (!category) throw new Error('Category not found');

  category.tasks.push(newTask);
  await saveMockData(data);
  return data;
};

export const deleteTask = async (categoryId: number, taskId: number): Promise<MockData> => {
  const data = await getMockData();
  const category = data.toDoList.find((cat) => cat.id === categoryId);

  if (!category) throw new Error('Category not found');

  category.tasks = category.tasks.filter((task) => task.id !== taskId);
  await saveMockData(data);
  return data;
};
