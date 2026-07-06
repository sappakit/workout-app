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
  const lastCompletedAt = useWorkoutRestTimerStore(
    (state) => state.lastCompletedAt,
  );

  const player = useAudioPlayer(REST_ALERT_SOUNDS.complete);

  const lastPlayedAtRef = useRef<number | null>(lastCompletedAt);

  const playRestCompleteSound = useCallback(() => {
    player.seekTo(0);
    player.volume = 1;
    player.play();
  }, [player]);

  useEffect(() => {
    if (!lastCompletedAt) return;
    if (lastPlayedAtRef.current === lastCompletedAt) return;

    lastPlayedAtRef.current = lastCompletedAt;

    if (soundEnabled) {
      playRestCompleteSound();
    }

    if (vibrationEnabled) {
      Vibration.vibrate(300);
    }
  }, [lastCompletedAt, playRestCompleteSound, soundEnabled, vibrationEnabled]);
}
