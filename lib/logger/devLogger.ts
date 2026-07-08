type LogContext = Record<string, unknown>;

function isDev() {
  return __DEV__;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export const devLogger = {
  info(message: string, context?: LogContext) {
    if (!isDev()) return;

    console.log(`[INFO] ${message}`, context ?? "");
  },

  warn(message: string, context?: LogContext) {
    if (!isDev()) return;

    console.warn(`[WARN] ${message}`, context ?? "");
  },

  error(message: string, error?: unknown, context?: LogContext) {
    if (!isDev()) return;

    console.error(`[ERROR] ${message}`);

    console.log("[ERROR DETAILS]", {
      message: getErrorMessage(error),
      context,
    });
  },
};
