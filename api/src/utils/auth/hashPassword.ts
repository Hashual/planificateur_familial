import { createHash } from "node:crypto";

export default function hashPassword(password: string): string {
	const hash = createHash("sha256");
	hash.update(password);
	return hash.digest("hex");
}