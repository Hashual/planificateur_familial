import {SqlQuery} from "../../db";
import {QueryResult, ResultSetHeader, RowDataPacket} from "mysql2";

type TodoListTask = {
    id: number;
    title: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    todoListId: number;
    completedDate: boolean;
}

function formatRowData(row: RowDataPacket): TodoListTask {
    return {
        id: row.id,
        title: row.title,
        dueDate: row.dueDate ? new Date(row.dueDate) : null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        todoListId: row.todoListId,
        completedDate: row.completedDate
    };
}

export const createTodoListTask = async(todoListId: number, title: string, dueDate: Date | null | undefined): Promise<number> => {
    const result : ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO todoListTask (title, dueDate, todoListId) VALUES (?, ?, ?)", [title, dueDate, todoListId]);
    return result.insertId;
}

export const updateTodoListTask = async(id: number, title: string, dueDate: Date | null | undefined, completedDate: Date | null | undefined): Promise<boolean> => {
    let result;
    if (completedDate) {
        result = await SqlQuery<ResultSetHeader>("UPDATE todoListTask SET title = ?, dueDate = ?, completedDate = ? WHERE id = ?", [title, dueDate, completedDate, id]);
    } else {
        result = await SqlQuery<ResultSetHeader>("UPDATE todoListTask SET title = ?, dueDate = ?, completedDate = null WHERE id = ?", [title, dueDate, id]);
    }

    return result.affectedRows > 0;
}

export const deleteTodoListTask = async(id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM todoListTask WHERE id = ?", [id]);
}

export const getTodoListTasks = async(todoListId: number): Promise<TodoListTask[]> => {
    const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM todoListTask WHERE todoListId = ?", [todoListId]);
    return result.map((row: RowDataPacket) => {
        return formatRowData(row)
    }) as TodoListTask[];
}

export const getTodoListTaskById = async(id: number): Promise<TodoListTask | null> => {
    const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM todoListTask WHERE id = ?", [id]);
    if (result.length === 0) {
        return null;
    }
    const row = result[0];
    return formatRowData(row);
}

export const getTasksAmount = async(todoListId: number, isComplete: boolean): Promise<number> => {
    if (isComplete) {
        const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT COUNT(*) as amount FROM todoListTask WHERE todoListId = ? AND completedDate IS NOT NULL", [todoListId]);
        return result[0].amount;
    } else {
        const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT COUNT(*) as amount FROM todoListTask WHERE todoListId = ? AND completedDate IS NULL", [todoListId]);
        return result[0].amount;
    }
}

export const getTasksBetweenTwoDates = async(startDate: Date, endDate: Date): Promise<TodoListTask[]> => { 
    const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM todoListTask WHERE dueDate BETWEEN ? AND ?", [startDate, endDate]);
    return result.map((row: RowDataPacket) => {
        return formatRowData(row)
    }) as TodoListTask[];
}