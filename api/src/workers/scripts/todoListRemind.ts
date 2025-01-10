import { TODO_LIST_REMING_LAST_CHECK_SETTING_NAME } from "../../constants/settings";
import { getSetting, setSetting } from "../../models/settings/settings";
import { getTodoListById } from "../../models/todo/todoList";
import { getTasksBetweenTwoDates } from "../../models/todo/todoListTask";
import { getUserById } from "../../models/user/user";
import { sendNotificationToUser } from "../../services/notifications";

export async function Run() {
	const lastCheckSetting = await getSetting(TODO_LIST_REMING_LAST_CHECK_SETTING_NAME);
	const lastCheck = lastCheckSetting ? new Date(lastCheckSetting.value) : new Date(0);

	const currentDate = new Date();
	const tasksToSendNotification = await getTasksBetweenTwoDates(lastCheck, currentDate);
	console.log(`Found ${tasksToSendNotification.length} tasks to send notification`);

	// Send notification
	for (const task of tasksToSendNotification) {
		const todoList = (await getTodoListById(task.todoListId))!;
		const owner = await getUserById(todoList.ownerId);

		sendNotificationToUser({
			title: 'Rappel de votre liste de tâches',
			body: `La date limite de la tâche "${task.title}" est atteinte.`,
			data: {}
		}, owner!);
	}

	await setSetting(TODO_LIST_REMING_LAST_CHECK_SETTING_NAME, currentDate.toISOString());
}