export function createClientId(prefix = "id") {
  const timestamp = Date.now().toString(36); // time-based
  const random = Math.random().toString(36).slice(2, 10); // random chunk

  return `${prefix}-${timestamp}-${random}`;
}
