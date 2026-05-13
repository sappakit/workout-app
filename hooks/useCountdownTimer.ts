import { useEffect, useState } from "react";

type CountdownTimerState = {
  isActive: boolean;
  endAt: number | null;
};

const INITIAL_TIMER_STATE: CountdownTimerState = {
  isActive: false,
  endAt: null,
};

export function useCountdownTimer() {
  const [timer, setTimer] = useState<CountdownTimerState>(INITIAL_TIMER_STATE);
  const [now, setNow] = useState(Date.now());

  // Ticking effect
  useEffect(() => {
    if (!timer.isActive || !timer.endAt) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isActive, timer.endAt]);

  // Auto-stop effect
  useEffect(() => {
    if (!timer.isActive || !timer.endAt) return;

    if (timer.endAt <= now) {
      stop();
    }
  }, [now, timer.isActive, timer.endAt]);

  const remainingSeconds =
    timer.isActive && timer.endAt
      ? Math.max(0, Math.ceil((timer.endAt - now) / 1000))
      : 0;

  const start = (seconds: number) => {
    if (seconds <= 0) return;

    const now = Date.now();

    setNow(now);
    setTimer({
      isActive: true,
      endAt: now + seconds * 1000,
    });
  };

  const stop = () => {
    setTimer(INITIAL_TIMER_STATE);
  };

  const increase = (seconds = 15) => {
    if (!timer.isActive || !timer.endAt) return;

    setTimer((prev) => {
      if (!prev.isActive || !prev.endAt) return prev;

      return {
        ...prev,
        endAt: prev.endAt + seconds * 1000,
      };
    });
  };

  const decrease = (seconds = 15) => {
    if (!timer.isActive || !timer.endAt) return;

    const now = Date.now();

    setNow(now);

    setTimer((prev) => {
      if (!prev.isActive || !prev.endAt) return prev;

      const nextEndAt = prev.endAt - seconds * 1000;

      if (nextEndAt <= now) {
        return INITIAL_TIMER_STATE;
      }

      return {
        ...prev,
        endAt: nextEndAt,
      };
    });
  };

  return {
    isActive: timer.isActive,
    remainingSeconds,
    start,
    stop,
    increase,
    decrease,
  };
}
