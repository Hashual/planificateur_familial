import { Alert, Platform } from "react-native"

export default function Confirmation(
	title: string,
	message: string,
	onConfirm: () => void | Promise<void>
) {
	if (Platform.OS === "web") {
		const confirmed = confirm(message);
		if (confirmed) {
			onConfirm();
		}
	}
	Alert.alert(title, message, [
		{ text: "Annuler", style: "cancel" },
		{
			text: "Confirmer",
			style: "destructive",
			onPress: onConfirm
		}
	])
}