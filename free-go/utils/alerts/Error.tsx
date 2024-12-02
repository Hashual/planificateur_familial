import { Alert } from "react-native";

export default function Error(
	title: string,
	message: string,
	error?: unknown
) {
	Alert.alert(title, message);

	if (error) {
		console.error(error);
	}
}