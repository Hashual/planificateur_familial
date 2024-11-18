import {SqlQuery} from "../utils/Database";
import {QueryResult, ResultSetHeader, RowDataPacket} from "mysql2";

export type TodoList = {
    id: number;
    title: string;
    description: string;
}


const createTodoList = async (title: string, description: string): Promise<number> => {
    const result : ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO todoList (title, description) VALUES (?, ?)", [title, description]);
    return result.insertId;
}

const updateTodoList = async (id: number, title: string, description: string): Promise<number> => {
    const result : ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE todoList SET title = ?, description = ? WHERE id = ?", [title, description, id]);
    return result.affectedRows;
}

const deleteTodoList = async (id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM todoList WHERE id = ?", [id]);
}

const getAllTodoLists = async (): Promise<TodoList[]> => {
    return await SqlQuery<RowDataPacket[]>("SELECT * FROM todoList") as TodoList[];
}

const getTodoListById = async (id: number): Promise<TodoList> => {
    return (await SqlQuery<RowDataPacket[]>(`SELECT * FROM todoList WHERE id = ${id}`))[0] as TodoList;
}

export {createTodoList, updateTodoList, deleteTodoList, getAllTodoLists, getTodoListById};