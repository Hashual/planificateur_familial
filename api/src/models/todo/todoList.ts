import { SqlQuery } from "../../db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";

export type TodoList = {
    id: number;
    title: string;
    tasksAmount: number;
    tasksInProgressAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export const createTodoList = async (title: string): Promise<number> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO todoList (title) VALUES (?)", [title]);
    return result.insertId;
}

export const updateTodoList = async (id: number, title: string): Promise<boolean> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE todoList SET title = ? WHERE id = ?", [title, id]);
    return result.affectedRows > 0;
}

export const deleteTodoList = async (id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM todoList WHERE id = ?", [id]);
}

export const getAllTodoLists = async (): Promise<TodoList[]> => {
    const result = await SqlQuery<RowDataPacket[]>(`
        SELECT
            todoList.id,
            todoList.title,
            todoList.createdAt,
            todoList.updatedAt,
            COUNT(todoListTask.id) AS tasksAmount,
            COUNT(CASE WHEN todoListTask.completedDate IS NULL THEN 1 END) AS tasksInProgressAmount
        FROM todoList
                 LEFT JOIN todoListTask ON todoList.id = todoListTask.todoListId
        GROUP BY todoList.id
    `);

    return result.map((row: RowDataPacket) => {
        return {
            id: row.id,
            title: row.title,
            tasksAmount: row.tasksAmount,
            tasksInProgressAmount: row.tasksInProgressAmount,
            createdAt: new Date(row.createdAt),
            updatedAt: row.updatedAt
        }
    }) as TodoList[];
}

export const getTodoListById = async (id: number): Promise<TodoList | undefined> => {
    const result = await SqlQuery<RowDataPacket[]>(`
        SELECT 
            todoList.id,
            todoList.title,
            todoList.createdAt,
            todoList.updatedAt,
            COUNT(todoListTask2.id) AS tasksAmount,
            COUNT(todoListTask.id) AS tasksInProgressAmount
        FROM todoList
        LEFT JOIN todoListTask ON todoList.id = todoListTask.todoListId AND todoListTask.completedDate IS NULL
        LEFT JOIN todoListTask AS todoListTask2 ON todoList.id = todoListTask2.todoListId
        WHERE todoList.id = ?
        GROUP BY todoList.id
    `, [id]);

    if (result.length === 0) {
        return undefined;
    }

    const row = result[0];

    return {
        id: row.id,
        title: row.title,
        tasksAmount: row.tasksAmount,
        tasksInProgressAmount: row.tasksInProgressAmount,
        createdAt: new Date(new Date(row.createdAt)),
        updatedAt: new Date(row.updatedAt)
    }
}