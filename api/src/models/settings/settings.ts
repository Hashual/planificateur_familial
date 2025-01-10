import { RowDataPacket } from "mysql2";
import { SqlQuery } from "../../db";

type Setting = {
	id: number;
	name: string;
	value: string;
}

export async function getSetting(name: string): Promise<Setting | null> {
	const res = await SqlQuery<RowDataPacket[]>(`
		SELECT *
		FROM settings
		WHERE name = ?
	`, [name]);

	return (res[0] ?? null) as Setting | null;
}

export async function setSetting(name: string, value: string) {
	const exists = await getSetting(name);
	if (exists) {
		await SqlQuery<RowDataPacket[]>(`
			UPDATE settings
			SET value = ?
			WHERE name = ?
		`, [value, name]);
	} else {
		await SqlQuery<RowDataPacket[]>(`
			INSERT INTO settings (name, value)
			VALUES (?, ?)
		`, [name, value]);
	}
}