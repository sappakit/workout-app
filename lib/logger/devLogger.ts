type LogContext = Record<string, unknown>;

export const devLog = {
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

    console.error(`[ERROR] ${message}`, {
      message: getErrorMessage(error),
      stack: getErrorStack(error),
      context,
      rawError: error,
    });
  },
};

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

function getErrorStack(error: unknown) {
  if (error instanceof Error) {
    return error.stack;
  }

  return undefined;
}
