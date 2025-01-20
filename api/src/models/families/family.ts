import { ResultSetHeader, RowDataPacket } from "mysql2";
import { SqlQuery } from "../../db";
import generateJoinCode from "../../utils/families/generateJoinCode";
import { User } from "../user/user";

export type Family = {
	id: number;
	name: string;
	ownerId: number;
	joinCode: string;
	created_at: Date;
	updated_at: Date;
}

export async function generateNoUsedJoinCode(): Promise<string> {
	const joinCode = generateJoinCode();
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT id FROM family
		WHERE joinCode = ?
	`, [joinCode]);

	if (result.length > 0) {
		return generateNoUsedJoinCode();
	}

	return joinCode;
}

export async function createFamily(name: string, owner: User): Promise<number> {
	const result = await SqlQuery<ResultSetHeader>(`
		INSERT INTO family (name, ownerId, joinCode)
		VALUES (?, ?, ?)
	`, [name, owner.id, await generateNoUsedJoinCode()]);

	return result.insertId;
}

export async function getUserFamilies(user: User) {
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT * FROM family
		WHERE ownerId = ?
	`, [user.id]);

	return result as Family[];
}

export async function getFamilyById(familyId: number): Promise<Family | undefined> {
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT * FROM family
		WHERE id = ?
	`, [familyId]);

	if (result.length === 0) {
		return undefined;
	}

	return result[0] as Family;
	
}