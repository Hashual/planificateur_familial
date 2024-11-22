export type Task = {
  id: number;
  name: string;
  dueDate: Date | null;
  completedDate: Date | null;
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
