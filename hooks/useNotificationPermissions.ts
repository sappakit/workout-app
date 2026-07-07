import { devLog } from "@/lib/logger/devLogger";
import { setupNotificationChannels } from "@/lib/notifications/shared/notificationChannels";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function useNotificationPermissions() {
  useEffect(() => {
    async function setupNotifications() {
      await setupNotificationChannels();

      const permissions = await Notifications.getPermissionsAsync();

      if (permissions.granted) return;

      await Notifications.requestPermissionsAsync();
    }

    void setupNotifications().catch((error) => {
      devLog.error("Failed to setup notifications", error);
    });
  }, []);
}
