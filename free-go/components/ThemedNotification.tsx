import * as Notifications from 'expo-notifications';

interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  trigger: Notifications.NotificationTriggerInput | null;

}

export async function sendThemedNotification(content: NotificationContent) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: content.title,
      body: content.body,
      data: content.data || {},
    },
    trigger: content.trigger,
  });
}
