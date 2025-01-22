enum UserProvider {
	Google = 'google',
	Local = 'local'
}

export type User = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	avatarUrl: string;
	provider: UserProvider | null;
	providerId: string | null;
	createdAt: Date;
	updatedAt: Date;
}