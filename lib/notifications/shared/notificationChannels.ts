import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const NOTIFICATION_CHANNEL_IDS = {
  restTimer: "rest-timer",
  workoutSchedule: "workout-schedule",
} as const;

export type NotificationChannelId =
  (typeof NOTIFICATION_CHANNEL_IDS)[keyof typeof NOTIFICATION_CHANNEL_IDS];

// Set up Android notification channels used by the app
export async function setupNotificationChannels() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(
    NOTIFICATION_CHANNEL_IDS.restTimer,
    {
      name: "Rest Timer",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 300, 150, 300],
    },
  );

  // TODO: add workout schedule reminders
  //   await Notifications.setNotificationChannelAsync(
  //     NOTIFICATION_CHANNEL_IDS.workoutSchedule,
  //     {
  //       name: "Workout Schedule",
  //       importance: Notifications.AndroidImportance.DEFAULT,
  //     },
  //   );
}
