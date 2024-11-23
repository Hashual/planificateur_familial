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

export const createTodoListTask = async(todoListId: number, title: string, dueDate: Date | null): Promise<number> => {
    const result : ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO todoListTask (title, dueDate, todoListId) VALUES (?, ?, ?)", [title, dueDate, todoListId]);
    return result.insertId;
}

export const updateTodoListTask = async(id: number, title: string, dueDate: Date | null, isComplete: boolean): Promise<boolean> => {
    const result : ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE todoListTask SET title = ?, dueDate = ?, isComplete = ? WHERE id = ?", [title, dueDate, isComplete, id]);
    return result.affectedRows > 0;
}

export const deleteTodoListTask = async(id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM todoListTask WHERE id = ?", [id]);
}

export const getTasksAmount = async(todoListId: number, isComplete: boolean): Promise<number> => {
	const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT COUNT(*) as amount FROM todoListTask WHERE todoListId = ? AND isComplete = ?", [todoListId, isComplete]);
	return result[0].amount;
}