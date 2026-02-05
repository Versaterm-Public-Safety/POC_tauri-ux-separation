import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { UIInteraction } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'interactions.jsonl');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function logInteraction(sessionId: string, interaction: UIInteraction): void {
  const logEntry = {
    sessionId,
    ...interaction,
    loggedAt: new Date().toISOString(),
  };

  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(LOG_FILE, logLine, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    } else {
      console.log(`✅ [${sessionId.substring(0, 8)}] Logged interaction: ${interaction.component}.${interaction.action}`);
      console.log(`   Log file: ${LOG_FILE}`);
    }
  });
}

export function logEvent(sessionId: string, eventType: string, data: unknown): void {
  const logEntry = {
    sessionId,
    eventType,
    data,
    timestamp: Date.now(),
    loggedAt: new Date().toISOString(),
  };

  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(LOG_FILE, logLine, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}
