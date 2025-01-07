export type Task = {
  id: number;
  title: string;
  dueDate: Date | null;
  completedDate: Date | null;
};

export type ToDoList = {
  id: number;
  name: string;
  completed: boolean;
  tasks: Task[];
};

export type Article = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  quantity: number;
  isChecked: boolean;
};

export type ShoppingList = {
  id: number;
  name: string;
  articles: Article[];
}

export type MockData = {
  toDoLists: ToDoList[],
  shoppingLists: ShoppingList[],
};
