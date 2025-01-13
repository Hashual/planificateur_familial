import { FAMILY_JOIN_CODE_CHARACTERS, FAMILY_JOIN_CODE_LENGTH } from "../../constants/families";

export default function generateJoinCode() {
	let result = '';
	for (let i = 0; i < FAMILY_JOIN_CODE_LENGTH; i++) {
		result += FAMILY_JOIN_CODE_CHARACTERS.charAt(Math.floor(Math.random() * FAMILY_JOIN_CODE_CHARACTERS.length));
	}
	return result;
}