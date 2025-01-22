import { RowDataPacket } from "mysql2";
import { SqlQuery } from "../../db";
import { batchGetUsersById, getUserById, User } from "../user/user";
import { Family, getUserOwnedFamilies } from "./family";

export enum FamilyMemberRole {
	Owner = 'owner',
	Member = 'member'
}

type FamilyMember = {
	user: User,
	role: FamilyMemberRole,
	joinAt: Date | null
}

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

export async function getFamilyMembers(family: Family): Promise<FamilyMember[]> {
	const membersIds = await SqlQuery<RowDataPacket[]>(`
		SELECT userId, created_at AS joinAt FROM family_members
		WHERE familyId = ?
	`, [family.id]);

	const users = await batchGetUsersById(membersIds.map(row => row.userId as number));
	const owner = await getUserById(family.ownerId)!;

	return {
		...users.map(user => ({
			user,
			role: FamilyMemberRole.Member,
			joinAt: membersIds.find(row => row.userId === user.id)!.joinAt
		})),
		...{
			user: owner,
			role: FamilyMemberRole.Owner,
			joinAt: null
		}
	}
}