import { getUserNotificationTokens, removeNotificationToken, UserNotificationToken } from "../models/notifications/tokens";
import { getUserById, User } from "../models/user/user";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

type Notification = {
	title: string;
	body: string;
	sound?: string | null | {
        critical?: boolean;
        name?: string | null;
        volume?: number;
    };
	data: { [key: string]: string }
}

const expo = new Expo()

export async function sendNotification(notification: Notification, tokens: UserNotificationToken[]) {
	const messages: ExpoPushMessage[] = tokens.map(token => {
		return {
			to: token.token,
			sound: notification.sound,
			title: notification.title,
			body: notification.body,
			data: notification.data
		}
	})

	const chunks = expo.chunkPushNotifications(messages);
	const tickets: ExpoPushTicket[] = [];
	
	const promises: Promise<void>[] = [];	
	for (const chunk of chunks) {
		promises.push(new Promise<void>((resolve, reject) => {
			expo.sendPushNotificationsAsync(chunk).then((ticketChunk) => {
				console.log(ticketChunk);
				tickets.push(...ticketChunk);
				resolve();
			}).catch((error) => {
				console.log(error);
				reject(error);
			})
		}))
	}

	Promise.all(promises).then( () => {
		checkNotificationsTickets(tickets, tokens);
	})
}

export async function sendNotificationToUser(notification: Notification, user: User) {
	const tokens = await getUserNotificationTokens(user);
	return sendNotification(notification, tokens);
}


export async function checkNotificationsTickets(tickets: ExpoPushTicket[], tokens: UserNotificationToken[]) {
	const promises: Promise<void>[] = [];
	for (const ticket of tickets) {
		if (ticket.status === 'error') {
			if (ticket.details && ticket.details.error === 'DeviceNotRegistered') {
				const token = tokens.find(token => token.token === ticket.details?.expoPushToken!);
				if (token) {
					removeNotificationToken(token);
				}
			}
		}
	}

	return Promise.all(promises);
}


// (async() => {
// 	const user = await getUserById(2);
// 	sendNotificationToUser({
// 		body: "Hello",
// 		data: {},
// 		title: "Hello"
// 	}, user!);
// })()

export function Load() {
	return null;
}