import { NOTIFICATION_CHANNEL_IDS } from "./shared/notificationChannels";
import {
  cancelScheduledNotification,
  scheduleTimeIntervalNotification,
} from "./shared/notificationService";

let scheduledRestNotificationId: string | null = null;

// Schedule a notification when the rest timer ends
export async function scheduleRestCompleteNotification(seconds: number) {
  if (seconds <= 0) return;

  await cancelRestCompleteNotification();

  scheduledRestNotificationId = await scheduleTimeIntervalNotification({
    title: "Rest complete",
    body: "Time for your next set.",
    seconds,
    channelId: NOTIFICATION_CHANNEL_IDS.restTimer,
    sound: true,
    data: {
      type: "REST_TIMER_COMPLETE",
    },
  });
}

// Cancel the currently scheduled rest timer notification
export async function cancelRestCompleteNotification() {
  await cancelScheduledNotification(scheduledRestNotificationId);

  scheduledRestNotificationId = null;
}
