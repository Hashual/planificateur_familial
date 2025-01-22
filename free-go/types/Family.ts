import { User } from "./User";

export enum FamilyMemberRole {
	Owner = "owner",
	Member = "member"
}

export type Family = {
	id: number;
	name: string;
	ownerId: number;
	joinCode: string;
	created_at: Date;
	updated_at: Date;
}

export type FamilyMember = {
	user: User;
	role: FamilyMemberRole;
	joinAt: Date | null;
}