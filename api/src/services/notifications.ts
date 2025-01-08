import { getUserNotificationTokens, removeNotificationToken, UserNotificationToken } from "../models/notifications/tokens";
import { getUserById, User } from "../models/user/user";

type Notification = {
	title: string;
	body: string;
	data: { [key: string]: string }
}

export default function sendNotification(notification: Notification, token: UserNotificationToken): Promise<boolean> {
	return new Promise(async (resolve) => {
		const res = await fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
			  Accept: 'application/json',
			  'Accept-encoding': 'gzip, deflate',
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				to: token.token,
				...notification
			})
		});

		if (res.status != 200) {
			try {
				const json = await res.json();
				if (json?.data?.details?.error == "DeviceNotRegistered") {
					await removeNotificationToken(token);
				}
			} catch (e) {
				console.error(e);
			}
		}

		resolve(res.status == 200);
	})
}

export async function sendNotificationToUser(notification: Notification, user: User) {
	const tokens = await getUserNotificationTokens(user);

	const promises: Promise<boolean>[] = tokens.map(token => sendNotification(notification, token));

	return Promise.all(promises);
}

(async() => {
	const user = await getUserById(1);
	sendNotificationToUser({
		body: "Hello",
		data: {},
		title: "Hello"
	}, user!);
})()

export function Load() {
	return null;
}