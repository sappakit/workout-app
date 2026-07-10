import { useWorkoutRestTimerStore } from "@/stores/workoutRestTimerStore";
import { useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useRef } from "react";
import { Vibration } from "react-native";

const REST_ALERT_SOUNDS = {
  complete: require("@/assets/sounds/rest-complete-01.mp3"),
} as const;

interface UseRestCompleteAlertParams {
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
}

export function useRestCompleteAlert({
  soundEnabled = true,
  vibrationEnabled = true,
}: UseRestCompleteAlertParams = {}) {
  const restCompletedAt = useWorkoutRestTimerStore(
    (state) => state.restCompletedAt,
  );

  const player = useAudioPlayer(REST_ALERT_SOUNDS.complete);

  const lastPlayedAtRef = useRef<number | null>(restCompletedAt);

  const playRestCompleteSound = useCallback(() => {
    player.seekTo(0);
    player.volume = 1;
    player.play();
  }, [player]);

  useEffect(() => {
    if (!restCompletedAt) return;
    if (lastPlayedAtRef.current === restCompletedAt) return;

    lastPlayedAtRef.current = restCompletedAt;

    if (soundEnabled) {
      playRestCompleteSound();
    }

    if (vibrationEnabled) {
      Vibration.vibrate(300);
    }
  }, [restCompletedAt, playRestCompleteSound, soundEnabled, vibrationEnabled]);
}
