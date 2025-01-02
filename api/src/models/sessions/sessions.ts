import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../user/user";
import { SqlQuery } from "../../db";

type UserSession = {
	id: number;
	userId: number;
	token: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7;
const SESSION_TOKEN_LENGTH = 64;

function generateToken() {
	let token = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	
	for (let i = 0; i < SESSION_TOKEN_LENGTH; i++) {
		token += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	
	return token;
}

export async function createSessionForUser(user: User): Promise<number> {
	const result = await SqlQuery<ResultSetHeader>(`
		INSERT INTO user_session (userId, token, expiresAt)
		VALUES (?, ?, ?)
	`, [user.id, generateToken(), new Date(Date.now() + SESSION_DURATION)]);
		
	return result.insertId;
}

export async function getSessionById(id: number): Promise<UserSession | null> {
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT *
		FROM user_session
		WHERE id = ? AND expiresAt > NOW()
	`, [id]);
	
	return (result[0] || null) as UserSession | null;
}

export async function getSessionByToken(token: string): Promise<UserSession | null> {
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT *
		FROM user_session
		WHERE token = ? AND expiresAt > NOW()
	`, [token]);
	
	return (result[0] || null) as UserSession | null;
}

// Automatically clean up expired sessions
setInterval(async () => {
	await SqlQuery<ResultSetHeader>(`
		DELETE FROM user_session
		WHERE expiresAt < ?
	`, [new Date()]);
}, 1000 * 60 * 60);