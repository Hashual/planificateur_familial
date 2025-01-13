import { SqlQuery } from "../../db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";

type shoppingListArticles = {
    id: number;
    title: string;
    quantity: number;
    dueDate: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    shoppingListId: number;
}

export const createShoppingListArticle = async (shoppingListId: number, title: string, dueDate: Date | null | undefined, quantity: number): Promise<number> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO shoppingListArticle (shoppingListId, title, dueDate, quantity) VALUES (?, ?, ?, ?)", [shoppingListId, title, dueDate, quantity]);
    return result.insertId;
}

export const updateShoppingListArticle = async (id: number, title: string, quantity: number, completedAt: string | null | undefined): Promise<boolean> => {
    const completedAtDate = completedAt ? new Date(completedAt) : null;
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE shoppingListArticle SET title = ? , quantity = ? , completedAt = ? WHERE id = ?", [title, quantity, completedAtDate, id]);
    return result.affectedRows > 0;
}

export const deleteShoppingListArticle = async (id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM shoppingListArticle WHERE id = ?", [id]);
}

export const getShoppingListArticles = async (shoppingListId: number): Promise<shoppingListArticles[]> => {
    const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM shoppingListArticle WHERE shoppingListId = ?", [shoppingListId]);
    return result.map((row: RowDataPacket) => {
        return {
            id: row.id,
            title: row.title,
            quantity: row.quantity,
            dueDate: row.dueDate ? new Date(row.dueDate) : null,
            completedAt: row.completedAt ? new Date(row.completedAt) : null,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            shoppingListId: row.shoppingListId,
        }
    }) as shoppingListArticles[];
}

export const getShoppingListArticleById = async (id: number): Promise<shoppingListArticles | null> => {
    const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM shoppingListArticle WHERE id = ?", [id]);
    if (result.length === 0) {
        return null;
    }
    const row = result[0];
    return {
        id: row.id,
        title: row.title,
        quantity: row.quantity,
        dueDate: row.dueDate ? new Date(row.dueDate) : null,
        completedAt: row.completedAt ? new Date(row.completedAt) : null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        shoppingListId: row.shoppingListId,
    } as shoppingListArticles;
}

export const getArticlesAmount = async (shoppingListId: number, completedAt: Date): Promise<number> => {
    const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT COUNT(*) AS amount FROM shoppingListArticle WHERE shoppingListId = ? AND completedAt = ?", [shoppingListId, completedAt]);
    return result[0].amount;
}