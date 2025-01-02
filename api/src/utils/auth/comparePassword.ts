import hashPassword from "./hashPassword";

export default function comparePassword(password: string, hashedPassword: string): boolean {
	return hashPassword(password) === hashedPassword;	
}