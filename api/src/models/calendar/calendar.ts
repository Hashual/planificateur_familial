import { SqlQuery } from "../../db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../user/user";

export type Calendar = {
    id: number;
    ownerId: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export const createCalendar = async (title: string, owner: User): Promise<number> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO calendar (title, ownerId) VALUES (?, ?)", [title, owner.id]);
    return result.insertId;
}

export const updateCalendar = async (id: number, title: string): Promise<boolean> => {
    const result: ResultSetHeader = await SqlQuery<ResultSetHeader>("UPDATE calendar SET title = ? WHERE id = ?", [title, id]);
    return result.affectedRows > 0;
}

export const deleteCalendar = async (id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM calendar WHERE id = ?", [id]);
}

export const getAllCalendars = async (user: User): Promise<Calendar[]> => {
    const result = await SqlQuery<RowDataPacket[]>(`
        SELECT
            calendar.id,
            calendar.ownerId,
            calendar.title,
            calendar.createdAt,
            calendar.updatedAt
        FROM calendar
        WHERE calendar.ownerId = ?
    `, [user.id]);

    return result.map((row: RowDataPacket) => {
        return {
            id: row.id,
            ownerId: row.ownerId,
            title: row.title,
            createdAt: new Date(row.createdAt),
            updatedAt: row.updatedAt
        }
    }) as Calendar[];
}

export const getCalendarById = async (id: number): Promise<Calendar | undefined> => {
    const result = await SqlQuery<RowDataPacket[]>(`
        SELECT 
            calendar.id,
            calendar.ownerId
            calendar.title,
            calendar.createdAt,
            calendar.updatedAt
        FROM calendar
        WHERE calendar.id = ?
    `, [id]);

    if (result.length === 0) {
        return undefined;
    }

    const row = result[0];
    return {
        id: row.id,
        ownerId: row.ownerId,
        title: row.title,
        createdAt: new Date(row.createdAt),
        updatedAt: row.updatedAt
    };
}