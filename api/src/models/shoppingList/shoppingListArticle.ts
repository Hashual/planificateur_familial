import { SqlQuery } from "../../db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";

type shoppingList = {
    id: number;
    title: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
    shoppingListId: number;
    isCompleted: boolean;
}

const createShoppingListArticle = async (shoppingListId: number, title: string, dueDate: Date | null | undefined): Promise<number> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO shoppingListArticle (title, dueDate, shoppingListId) VALUES (?, ?, ?)", [title, dueDate, shoppingListId]);
    return result.insertId;
}

const updateShoppingListArticle = async (id: number, title: string, dueDate: Date | null | undefined, isCompleted: boolean): Promise<boolean> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE shoppingListArticle SET title = ?, dueDate = ?, isCompleted = ? WHERE id = ?", [title, dueDate, isCompleted, id]);
    return result.affectedRows > 0;
}

const deleteShoppingListArticle = async (id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM shoppingListArticle WHERE id = ?", [id]);
}

const getShoppingListArticles = async (shoppingListId: number): Promise<shoppingList[]> => {
    const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM shoppingListArticle WHERE shoppingListId = ?", [shoppingListId]);
    return result.map((row: RowDataPacket) => {
        return {
            id: row.id,
            title: row.title,
            dueDate: row.dueDate ? new Date(row.dueDate) : null,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            shoppingListId: row.shoppingListId,
            isCompleted: row.isCompleted
        }
    }) as shoppingList[];
}

const getShoppingListArticleById = async (id: number): Promise<shoppingList | null> => {
    const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM shoppingListArticle WHERE id = ?", [id]);
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
        shoppingListId: row.shoppingListId,
        isCompleted: row.isCompleted
    } as shoppingList;
}

const getArticlesAmount = async (shoppingListId: number, isCompleted: boolean): Promise<number> => {
    const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT COUNT(*) AS amount FROM shoppingListArticle WHERE shoppingListId = ? AND isCompleted = ?", [shoppingListId, isCompleted]);
    return result[0].amount;
}