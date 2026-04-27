import { useEffect, useState } from "react";

export function usePausableElapsedSeconds(startedAt: string | Date) {
  const [now, setNow] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [totalPausedMs, setTotalPausedMs] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const elapsedSeconds = getPausableElapsedSeconds({
    startedAt,
    now,
    totalPausedMs,
    pausedAt,
    isPaused,
  });

  const pause = () => {
    if (isPaused) return;

    const currentTime = Date.now();
    setNow(currentTime);
    setPausedAt(currentTime);
    setIsPaused(true);
  };

  const resume = () => {
    if (!isPaused || pausedAt == null) return;

    const currentTime = Date.now();

    setTotalPausedMs((prev) => prev + (currentTime - pausedAt));
    setPausedAt(null);
    setNow(currentTime);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (isPaused) {
      resume();
      return;
    }

    pause();
  };

  return {
    elapsedSeconds,
    isPaused,
    pause,
    resume,
    togglePause,
  };
}

function getPausableElapsedSeconds({
  startedAt,
  now,
  totalPausedMs,
  pausedAt,
  isPaused,
}: {
  startedAt: string | Date;
  now: number;
  totalPausedMs: number;
  pausedAt: number | null;
  isPaused: boolean;
}) {
  const startedAtTime =
    typeof startedAt === "string"
      ? new Date(startedAt).getTime()
      : startedAt.getTime();

  if (Number.isNaN(startedAtTime)) return 0;

  const currentTime = isPaused && pausedAt != null ? pausedAt : now;

  return Math.max(
    0,
    Math.floor((currentTime - startedAtTime - totalPausedMs) / 1000),
  );
}
