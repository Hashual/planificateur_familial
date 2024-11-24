import {SqlQuery} from "../../db";
import {QueryResult, ResultSetHeader, RowDataPacket} from "mysql2";

type TodoListTask = {
    id: number;
    title: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    todoListId: number;
    isComplete: boolean;
}

export const createTodoListTask = async(todoListId: number, title: string, dueDate: Date | null | undefined): Promise<number> => {
    const result : ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO todoListTask (title, dueDate, todoListId) VALUES (?, ?, ?)", [title, dueDate, todoListId]);
    return result.insertId;
}

export const updateTodoListTask = async(id: number, title: string, dueDate: Date | null | undefined, isComplete: boolean): Promise<boolean> => {
    const result : ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE todoListTask SET title = ?, dueDate = ?, isComplete = ? WHERE id = ?", [title, dueDate, isComplete, id]);
    return result.affectedRows > 0;
}

export const deleteTodoListTask = async(id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM todoListTask WHERE id = ?", [id]);
}

export const getTodoListTasks = async(todoListId: number): Promise<TodoListTask[]> => {
    const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM todoListTask WHERE todoListId = ?", [todoListId]);
    return result.map((row: RowDataPacket) => {
        return {
            id: row.id,
            title: row.title,
            dueDate: row.dueDate ? new Date(row.dueDate) : null,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            todoListId: row.todoListId,
            isComplete: row.isComplete
        }
    }) as TodoListTask[];
}

export const getTodoListTaskById = async(id: number): Promise<TodoListTask | null> => {
    const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM todoListTask WHERE id = ?", [id]);
    if (result.length === 0) {
        return null;
    }
    const row = result[0];
    return {
        id: row.id,
        title: row.title,
        dueDate: row.dueDate ? new Date(row.dueDate) : null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        todoListId: row.todoListId,
        isComplete: row.isComplete
    } as TodoListTask;
}

export const getTasksAmount = async(todoListId: number, isComplete: boolean): Promise<number> => {
	const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT COUNT(*) as amount FROM todoListTask WHERE todoListId = ? AND isComplete = ?", [todoListId, isComplete]);
	return result[0].amount;
}