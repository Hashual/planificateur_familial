export type Task = {
  id: number;
  name: string;
  dueDate: string | null;
  completedDate: string | null;
};

export type TaskList = {
  id: number;
  name: string;
  completed: boolean;
  tasks: Task[];
};

export type MockData = {
  toDoList: TaskList[];
};
