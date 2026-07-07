import * as Notifications from "expo-notifications";
import { NotificationChannelId } from "./notificationChannels";

type ScheduleTimeIntervalNotificationParams = {
  title: string;
  body: string;
  seconds: number;
  channelId: NotificationChannelId;
  sound?: boolean;
  data?: Record<string, unknown>;
};

// Schedule a one-time notification after a number of seconds
export async function scheduleTimeIntervalNotification({
  title,
  body,
  seconds,
  channelId,
  sound = true,
  data,
}: ScheduleTimeIntervalNotificationParams) {
  if (seconds <= 0) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound,
      data,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId,
    },
  });
}

// Cancel one scheduled notification by id
export async function cancelScheduledNotification(
  notificationId: string | null,
) {
  if (!notificationId) return;

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
