import { ResultSetHeader, RowDataPacket } from "mysql2";
import { SqlQuery } from "../../db";
import { User } from "../user/user";

export enum NotificationTokenProvider {
	Android = 'android',
}

export type UserNotificationToken = {
	id: number;
	userId: number;
	provider: NotificationTokenProvider,
	token: string
}

export async function registerUserNotificationToken(user: User, provider: NotificationTokenProvider, token: string): Promise<number | null> {
	if (await isTokenRegistred(user, provider, token)) {
		return null;
	}

	const result = await SqlQuery<ResultSetHeader>(`
		INSERT INTO user_notification_token (userId, provider, token)
		VALUES (?, ?, ?)
	`, [user.id, provider, token]);

	return result.insertId;
}

export async function isTokenRegistred(user: User, provider: NotificationTokenProvider, token: string): Promise<boolean> {
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT userId FROM user_notification_token
		WHERE userId = ? AND provider = ? AND token = ?
	`, [user.id, provider, token]);

	return result.length > 0;
}

export async function removeNotificationToken(token: UserNotificationToken): Promise<void> {
	await SqlQuery<ResultSetHeader>(`
		DELETE FROM user_notification_token
		WHERE id = ?
	`, [token.id]);
}

export async function getUserNotificationTokens(user: User): Promise<UserNotificationToken[]> {
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT id, userId, provider, token FROM user_notification_token
		WHERE userId = ?
	`, [user.id]);

	return result.map(row => ({
		id: row.id,
		userId: row.userId,
		provider: row.provider,
		token: row.token
	}));
}