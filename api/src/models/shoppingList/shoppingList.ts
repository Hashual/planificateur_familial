import { SqlQuery } from "../../db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";

type shoppingList = {
    id: number;
    title: string;
    numberOfArticles: number;
    createdAt: Date;
    updatedAt: Date;
}

export const createShoppingList = async (title: string): Promise<number> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO shoppingList (title) VALUES (?)", [title]);
    return result.insertId;
}

export const updateShoppingList = async (id: number, title: string): Promise<boolean> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE shoppingList SET title = ? WHERE id = ?", [title, id]);
    return result.affectedRows > 0;
}

export const deleteShoppingList = async (id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM shoppingList WHERE id = ?", [id]);
}

export const getAllShoppingLists = async (): Promise<shoppingList[]> => {
    const result = await SqlQuery<RowDataPacket[]>(`
        SELECT 
            shoppingList.id,
            shoppingList.title,
            shoppingList.createdAt,
            shoppingList.updatedAt,
            COUNT(shoppingListArticle.id) AS numberOfArticles
        FROM shoppingList
        LEFT JOIN shoppingListArticle ON shoppingList.id = shoppingListArticle.shoppingListId
        GROUP BY shoppingList.id
    `);

    return result.map((row: RowDataPacket) => {
        return {
            id: row.id,
            title: row.title,
            numberOfArticles: row.numberOfArticles,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }
    }) as shoppingList[];
}

export const getShoppingListById = async (id: number): Promise<shoppingList | undefined> => {
    const result = await SqlQuery<RowDataPacket[]>(`
        SELECT 
            shoppingList.id,
            shoppingList.title,
            shoppingList.createdAt,
            shoppingList.updatedAt,
            COUNT(shoppingListArticle.id) AS numberOfArticles
        FROM shoppingList
        LEFT JOIN shoppingListArticle ON shoppingList.id = shoppingListArticle.shoppingListId
        WHERE shoppingList.id = ?
    `, [id]);

    if (result.length === 0) {
        return undefined;
    }

    const row = result[0];
    return {
        id: row.id,
        title: row.title,
        numberOfArticles: row.numberOfArticles,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
    };
}