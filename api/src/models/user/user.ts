import {SqlQuery} from "../../db";
import { ResultSetHeader, RowDataPacket} from "mysql2";
import hashPassword from "../../utils/auth/hashPassword";

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
	// TODO: Add a type or an enum for provider
	provider: 'google' | 'local';
	providerId: string | null
}

export type User = UserCreate & {
	id: number;
	createdAt: Date;
	updatedAt: Date;
}

export async function createUser(user: UserCreate): Promise<number> {
	const hashedPassword = user.password ? hashPassword(user.password) : null;

	const result: ResultSetHeader = await SqlQuery<ResultSetHeader>(`
		INSERT INTO user (email, firstName, lastName, password, avatarUrl, provider, providerId)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, [user.email, user.firstName, user.lastName, hashedPassword, user.avatarUrl, user.provider, user.providerId]);

	return result.insertId;
}

export async function updateUser(id: number, user: Partial<UserUpdate>): Promise<boolean> {
	user.password = user.password ? hashPassword(user.password) : undefined;
	
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

// TODO: Change provider to an enum or a type
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

export async function getUserByEmail(email: string, password?: string): Promise<User | null> {
	const hashedPassword = password ? hashPassword(password) : undefined;

	const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>(`
		SELECT *
		FROM user
		WHERE email = ? ${hashedPassword ? 'AND password = ?' : ''}
	`, [email, hashedPassword]);

	if (result.length === 0) {
		return null;
	}

	const row = result[0];
	return getUserById(row.id as number);
}