export function getGroupedFieldError(
  errors: Record<string, { message?: string } | undefined> | undefined,
  ...fields: string[]
) {
  for (const field of fields) {
    const message = errors?.[field]?.message;
    if (message) return message;
  }

  return undefined;
}
