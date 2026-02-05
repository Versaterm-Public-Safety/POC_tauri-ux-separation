/**
 * UUID Generation Utility
 * Uses crypto.randomUUID() to generate RFC 4122 compliant UUIDs
 */

export function generateUUID(): string {
  return crypto.randomUUID();
}
