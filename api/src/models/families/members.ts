import { RowDataPacket } from "mysql2";
import { SqlQuery } from "../../db";
import { User } from "../user/user";
import { Family, getUserOwnedFamilies } from "./family";

export async function isInFamily(family: Family, user: User): Promise<boolean> {
	if (family.ownerId === user.id) { return true; }
	
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT * FROM family_members
		WHERE familyId = ? AND userId = ?
	`, [family.id, user.id]);

	return result.length > 0;
}

export async function joinFamily(family: Family, user: User) {
	if (await isInFamily(family, user)) {
		throw new Error("User is already in the family");
	}

	await SqlQuery<RowDataPacket[]>(`
		INSERT INTO family_members (familyId, userId)
		VALUES (?, ?)
	`, [family.id, user.id]);
}

export async function getUserFamilies(user: User) {
	const result = await SqlQuery<RowDataPacket[]>(`
		SELECT family.* FROM family_members
		JOIN family ON family_members.familyId = family.id
		WHERE userId = ?
	`, [user.id]);

	const ownedFamilies = await getUserOwnedFamilies(user);

	return [
		...result as Family[],
		...ownedFamilies
	];
}