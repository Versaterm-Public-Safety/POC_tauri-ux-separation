/**
 * UUID Generation Utility
 * Uses crypto.randomUUID() to generate RFC 4122 compliant UUIDs
 */

import { randomUUID } from 'crypto';

export function generateUUID(): string {
  return randomUUID();
}
