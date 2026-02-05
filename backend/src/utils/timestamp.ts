/**
 * ISO 8601 Timestamp Utility
 * Generates ISO 8601 formatted timestamp strings
 */

export function generateTimestamp(): string {
  return new Date().toISOString();
}
