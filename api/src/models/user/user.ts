import {SqlQuery} from "../../db";
import { ResultSetHeader, RowDataPacket} from "mysql2";

type UserUpdate = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	avatarUrl: string;
}

type UserCreate = {
	firstName: string;
	lastName: string;
	email: string;
	password: string | null;
	avatarUrl: string | null;
	provider: 'google' | 'local';
	providerId: string;
}

export type User = UserCreate & {
	id: number;
	createdAt: Date;
	updatedAt: Date;
}

export async function createUser(user: UserCreate): Promise<number> {
	const result: ResultSetHeader = await SqlQuery<ResultSetHeader>(`
		INSERT INTO user (email, firstName, lastName, password, avatarUrl, provider, providerId)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, [user.email, user.firstName, user.lastName, user.password, user.avatarUrl, user.provider, user.providerId]);

	return result.insertId;
}

export async function updateUser(id: number, user: Partial<UserUpdate>): Promise<boolean> {
	const result: ResultSetHeader = await SqlQuery<ResultSetHeader>(`
		UPDATE user
		SET ${Object.keys(user).map(key => `${key} = ?`).join(', ')}
		WHERE id = ?
	`, [...Object.values(user), id]);

	return result.affectedRows > 0;
}

export async function getUserById(id: number): Promise<User | null> {
	const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>(`
		SELECT *
		FROM user
		WHERE id = ?
	`, [id]);

	if (result.length === 0) {
		return null;
	}

	const row = result[0];
	return {
		...row,
		createdAt: new Date(row.createdAt),
		updatedAt: new Date(row.updatedAt)
	} as User;
}

export async function getUserByProvider(provider: string, providerId: string): Promise<User | null> {
	const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>(`
		SELECT id
		FROM user
		WHERE provider = ? AND providerId = ?
	`, [provider, providerId]);

	if (result.length === 0) {
		return null;
	}

	const row = result[0];
	return getUserById(row.id as number);
}