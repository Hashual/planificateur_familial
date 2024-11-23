import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { Article, MockData, ShoppingList, Task, ToDoList } from "@/mockapi/types";

const mockDataPath = FileSystem.documentDirectory + "mockData.json";

const initialData: MockData = require("../data/mockData.json") as MockData

// Gestion alternative pour le Web
let mockDataInMemory: MockData = { ...initialData };

const ensureFileExists = async () => {
  if (Platform.OS === "web") {
    console.log("Mode web détecté. Utilisation des données en mémoire.");
  } else {
    await ensureFileExistsNative();
  }
};

const ensureFileExistsNative = async () => {
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
  if (Platform.OS === "web") {
    return mockDataInMemory;
  }

  await ensureFileExists();
  const data = await FileSystem.readAsStringAsync(mockDataPath);
  try {
    const parsedData = JSON.parse(data);
    if (parsedData && parsedData.toDoLists) {
      return parsedData as MockData;
    } else {
      console.error("Les données lues ne sont pas au bon format:", parsedData);
      return { toDoLists: [], shoppingLists: [] };
    }
  } catch (error) {
    console.error("Erreur lors du parsing JSON:", error);
    return { toDoLists: [], shoppingLists: [] };
  }
};


const saveMockData = async (data: MockData): Promise<void> => {
  if (Platform.OS === "web") {
    mockDataInMemory = data; // Mise à jour en mémoire pour le web
  } else {
    await FileSystem.writeAsStringAsync(
      mockDataPath,
      JSON.stringify(data, null, 2)
    );
  }
};

export const addArticle = async (listId: number, newArticle: Article): Promise<MockData> => {
  const data = await getMockData();
  const shoppingList = data.shoppingLists.find((list) => list.id === listId);

  if (!shoppingList) throw new Error("List not found");

  shoppingList.articles.push(newArticle);
  await saveMockData(data);
  return data;
};

export const deleteArticle = async (listId: number, articleId: number): Promise<MockData> => {
  const data = await getMockData();
  const shoppingList = data.shoppingLists.find((list) => list.id === listId);

  if (!shoppingList) throw new Error("List not found"); 

  shoppingList.articles = shoppingList.articles.filter((article) => article.id !== articleId);
  await saveMockData(data);
  return data;
};

export const updateArticle = async (listId: number, updatedArticle: Article): Promise<MockData> => {
  const data = await getMockData();
  
  const shoppingList = data.shoppingLists.find((list) => list.id === listId);

  if (!shoppingList) throw new Error("List not found");

  const articleIndex = shoppingList.articles.findIndex((article) => article.id === updatedArticle.id);

  if (articleIndex === -1) {
    throw new Error("Task not found");
  }

  shoppingList.articles[articleIndex] = { ...shoppingList.articles[articleIndex], ...updatedArticle };

  await saveMockData(data);
  return data;
};

export const createShoppingList = async (listName: string): Promise<MockData> => {
  const data = await getMockData();

  const newList: ShoppingList = {
    id: data.shoppingLists.length ? Math.max(...data.shoppingLists.map(list => list.id)) + 1 : 1, 
    name: listName,
    articles: []
  };

  data.shoppingLists.push(newList);

  await saveMockData(data);

  return data;
};

export const deleteShoppingList = async (id: number): Promise<MockData> => {
  try {
    const data = await getMockData();

    const updatedShoppingList = data.shoppingLists.filter((list) => list.id !== id);
    data.shoppingLists = updatedShoppingList;
    await saveMockData(data);
    return data;
    
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste de courses:", error);
    throw new Error("Impossible de supprimer la liste.");
  }
};


export const addTask = async (listId: number, newTask: Task): Promise<MockData> => {
  const data = await getMockData();
  const taskList = data.toDoLists.find((list) => list.id === listId);

  if (!taskList) throw new Error("List not found");

  taskList.tasks.push(newTask);
  await saveMockData(data);
  return data;
};

export const deleteTask = async (listId: number, taskId: number): Promise<MockData> => {
  const data = await getMockData();
  const taskList = data.toDoLists.find((list) => list.id === listId);

  if (!taskList) throw new Error("List not found"); 

  taskList.tasks = taskList.tasks.filter((task) => task.id !== taskId);
  await saveMockData(data);
  return data;
};

export const updateTask = async (listId: number, updatedTask: Task): Promise<MockData> => {
  const data = await getMockData();
  
  const taskList = data.toDoLists.find((list) => list.id === listId);

  if (!taskList) throw new Error("List not found");

  const taskIndex = taskList.tasks.findIndex((task) => task.id === updatedTask.id);

  if (taskIndex === -1) {
    throw new Error("Task not found");
  }

  taskList.tasks[taskIndex] = { ...taskList.tasks[taskIndex], ...updatedTask };

  await saveMockData(data);
  return data;
};

export const createTaskList = async (listName: string): Promise<MockData> => {
  const data = await getMockData();

  const newList: ToDoList = {
    id: data.toDoLists.length ? Math.max(...data.toDoLists.map(list => list.id)) + 1 : 1, 
    name: listName,
    completed: false,
    tasks: []
  };

  data.toDoLists.push(newList);

  await saveMockData(data);

  return data;
};

export const deleteTaskList = async (id: number): Promise<MockData> => {
  try {
    const data = await getMockData();

    const updatedToDoList = data.toDoLists.filter((list) => list.id !== id);
    data.toDoLists = updatedToDoList;
    await saveMockData(data);
    return data;
    
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste de tâches:", error);
    throw new Error("Impossible de supprimer la liste.");
  }
};


