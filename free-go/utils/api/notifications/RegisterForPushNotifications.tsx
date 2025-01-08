import Error from "@/utils/alerts/Error";
import { IsLogin } from "../auth/IsLogin";
import * as Device from 'expo-device';
import Constants from "expo-constants";
import * as Notifications from 'expo-notifications';
import { useFetchQuery } from "@/hooks/useAPI";

export default async function RegisterForPushNotifications() {
	if (!(await IsLogin()) || !Device.isDevice) {
		return;
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
    }

    if (finalStatus !== 'granted') {
		Error("Notifications", "Vous ne receverez pas de notifications car vous n'avez pas autorisé l'application à en envoyer.");
		return;
    }
    
	const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
		Error("Notifications", "Impossible de récupérer l'identifiant du projet.");
	}
    try {
		const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId, })).data;
	
		useFetchQuery(`/notifications/push/token`, {
			method: 'POST',
			body: {
				token: pushTokenString,
			}
		})

		return pushTokenString;
    } catch (e: unknown) {
		console.error(e);
    }
}