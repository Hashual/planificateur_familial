import {SqlQuery} from "../../db";
import {QueryResult, ResultSetHeader, RowDataPacket} from "mysql2";

type CalendarEvent = {
    id: number;
    calendarId: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    color: string;
    isRecurrent: boolean;
}

function formatRowData(row: RowDataPacket): CalendarEvent {
    return {
        id: row.id,
        calendarId: row.calendarId,
        title: row.title,
        description: row.description,
        startDate: new Date(row.startDate),
        endDate: new Date(row.endDate),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        color: row.color,
        isRecurrent: row.isRecurrent
    };
}

export const createCalendarEvent = async(calendarId: number, title: string, description: string, startDate: Date, endDate: Date, color: string, isRecurrent: boolean): Promise<number> => {
    const result : ResultSetHeader = await SqlQuery<ResultSetHeader>("INSERT INTO calendarEvent (calendarId, title, description, startDate, endDate, color, isRecurrent) VALUES (?, ?, ?, ?, ?, ?, ?)", [calendarId, title, description, startDate, endDate, color, isRecurrent]);
    return result.insertId;
}

export const updateCalendarEvent = async(id: number, title: string, description: string, startDate: Date, endDate: Date, color: string, isRecurrent: boolean): Promise<boolean> => {
    const result = await SqlQuery<ResultSetHeader>("UPDATE calendarEvent SET title = ?, description = ?, startDate = ?, endDate = ?, color = ?, isRecurrent = ? WHERE id = ?", [title, description, startDate, endDate, color, isRecurrent, id]);
    return result.affectedRows > 0;
}

export const deleteCalendarEvent = async(id: number): Promise<void> => {
    await SqlQuery<QueryResult>("DELETE FROM calendarEvent WHERE id = ?", [id]);
}

export const getCalendarEvents = async(calendarId: number): Promise<CalendarEvent[]> => {
    const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM calendarEvent WHERE calendarId = ?", [calendarId]);
    return result.map((row: RowDataPacket) => {
        return formatRowData(row)
    }) as CalendarEvent[];
}

export const getCalendarEventById = async(id: number): Promise<CalendarEvent | null> => {
    const result : RowDataPacket[] = await SqlQuery<RowDataPacket[]>("SELECT * FROM calendarEvent WHERE id = ?", [id]);
    if (result.length === 0) {
        return null;
    }
    const row = result[0];
    return formatRowData(row);
}