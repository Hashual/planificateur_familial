import { SqlQuery } from "../../db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import {User} from "../user/user";

type shoppingList = {
    id: number;
    ownerId: number;
    title: string;
    numberOfArticles: number;
    numberOfInProgressArticles: number;
    createdAt: Date;
    updatedAt: Date;
}

export const createShoppingList = async (title: string, owner: User): Promise<number> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO shoppingList (title, owner) VALUES (?, ?)", [title, owner.id]);
    return result.insertId;
}

export const updateShoppingList = async (id: number, title: string): Promise<boolean> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE shoppingList SET title = ? WHERE id = ?", [title, id]);
    return result.affectedRows > 0;
}

export const deleteShoppingList = async (id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM shoppingList WHERE id = ?", [id]);
}

export const getAllShoppingLists = async (user: User): Promise<shoppingList[]> => {
    const result = await SqlQuery<RowDataPacket[]>(`
        SELECT 
            shoppingList.id,
            shoppingList.ownerId,
            shoppingList.title,
            shoppingList.createdAt,
            shoppingList.updatedAt,
            COUNT(CASE WHEN shoppingListArticle.completedAt IS NULL AND shoppingListArticle.id IS NOT NULL THEN 1 END) AS articlesInProgressAmount,
            COUNT(shoppingListArticle.id) AS numberOfArticles
        FROM shoppingList
        LEFT JOIN shoppingListArticle ON shoppingList.id = shoppingListArticle.shoppingListId
        WHERE shoppingList.ownerId = ?
        GROUP BY shoppingList.id
    `, [user.id]);

    return result.map((row: RowDataPacket) => {
        return {
            id: row.id,
            ownerId: row.ownerId,
            title: row.title,
            numberOfInProgressArticles: row.articlesInProgressAmount,
            numberOfArticles: row.numberOfArticles,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        }
    }) as shoppingList[];
}

export const getShoppingListById = async (id: number): Promise<shoppingList | undefined> => {
    const result = await SqlQuery<RowDataPacket[]>(`
        SELECT 
            shoppingList.id,
            shoppingList.ownerId,
            shoppingList.title,
            shoppingList.createdAt,
            shoppingList.updatedAt,
            COUNT(shoppingListArticle.id) AS numberOfArticles,
            COUNT(CASE WHEN shoppingListArticle.completedAt IS NULL AND shoppingListArticle.id IS NOT NULL THEN 1 END) AS articlesInProgressAmount
        FROM shoppingList
        LEFT JOIN shoppingListArticle ON shoppingList.id = shoppingListArticle.shoppingListId
        WHERE shoppingList.id = ?
        GROUP BY shoppingList.id
    `, [id]);

    if (result.length === 0) {
        return undefined;
    }

    const row = result[0];
    return {
        id: row.id,
        ownerId: row.ownerId,
        title: row.title,
        numberOfArticles: row.numberOfArticles,
        numberOfInProgressArticles: row.articlesInProgressAmount,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
    };
}