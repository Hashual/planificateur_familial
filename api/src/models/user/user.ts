import {SqlQuery} from "../../db";
import { ResultSetHeader, RowDataPacket} from "mysql2";
import hashPassword from "../../utils/auth/hashPassword";

export enum UserProvider {
	Google = 'google',
	Local = 'local'
}

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
	provider: UserProvider | null;
	providerId: string | null
}

export type User = UserCreate & {
	id: number;
	createdAt: Date;
	updatedAt: Date;
}

function formatUserRow(row: RowDataPacket) {
	return {
		...row,
		createdAt: new Date(row.createdAt),
		updatedAt: new Date(row.updatedAt)
	} as User;
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
	return formatUserRow(row) as User;
}

export async function batchGetUsersById(ids: number[]): Promise<User[]> {
	if (ids.length === 0) {
		return [];
	}

	const result: RowDataPacket[] = await SqlQuery<RowDataPacket[]>(`
		SELECT *
		FROM user
		WHERE id IN (?)
	`, [ids]);

	return result.map(formatUserRow);
}

export async function getUserByProvider(provider: UserProvider, providerId: string): Promise<User | null> {
	if (provider == UserProvider.Local) {
		throw new Error('Cannot get local user by provider');
	}

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