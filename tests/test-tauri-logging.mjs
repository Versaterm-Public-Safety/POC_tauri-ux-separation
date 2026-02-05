#!/usr/bin/env node
/**
 * Test: Tauri App Interaction Logging
 * 
 * Verifies that UI interactions from the Tauri desktop app
 * are properly logged to backend/logs/interactions.jsonl
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.join(__dirname, '../backend/logs/interactions.jsonl');
const CONSOLE_LOG = '/tmp/backend-console.log';

console.log('🧪 Testing Tauri App Interaction Logging\n');

let testsPassed = 0;
let testsFailed = 0;

function pass(message) {
  console.log(`✅ PASS: ${message}`);
  testsPassed++;
}

function fail(message) {
  console.error(`❌ FAIL: ${message}`);
  testsFailed++;
}

// Check backend connections
if (fs.existsSync(CONSOLE_LOG)) {
  const consoleContent = fs.readFileSync(CONSOLE_LOG, 'utf-8');
  const connectionLines = consoleContent.split('\n').filter(l => l.includes('Client connected'));
  
  if (connectionLines.length > 0) {
    pass(`Backend received ${connectionLines.length} WebSocket connection(s)`);
  } else {
    fail('No WebSocket connections detected');
    console.log('⚠️  Tauri app may not be connecting!');
  }
}

console.log('\n📋 Instructions:');
console.log('1. Click "Start Call" in Tauri window');
console.log('2. Click "End Call" after a moment');
console.log('\nWatching for interactions (30 seconds)...\n');

const initialSize = fs.existsSync(LOG_FILE) ? fs.statSync(LOG_FILE).size : 0;
let lastSize = initialSize;
let lastConsoleSize = fs.existsSync(CONSOLE_LOG) ? fs.statSync(CONSOLE_LOG).size : 0;

const startTime = Date.now();
const TIMEOUT = 30000;

const checkInterval = setInterval(() => {
  if (Date.now() - startTime > TIMEOUT) {
    console.log('\n⏱️  Timeout\n');
    clearInterval(checkInterval);
    printSummary();
    process.exit(testsFailed > 0 ? 1 : 0);
  }
  
  // Monitor console
  if (fs.existsSync(CONSOLE_LOG)) {
    const currentSize = fs.statSync(CONSOLE_LOG).size;
    if (currentSize > lastConsoleSize) {
      const newContent = fs.readFileSync(CONSOLE_LOG, 'utf-8').substring(lastConsoleSize);
      newContent.split('\n').forEach(line => {
        if (line.includes('Logged interaction')) {
          console.log(`📝 ${line}`);
        }
      });
      lastConsoleSize = currentSize;
    }
  }
  
  // Monitor log file
  if (fs.existsSync(LOG_FILE)) {
    const currentSize = fs.statSync(LOG_FILE).size;
    if (currentSize > lastSize) {
      console.log(`\n📄 Log file updated! (+${currentSize - lastSize} bytes)\n`);
      
      const content = fs.readFileSync(LOG_FILE, 'utf-8');
      const lines = content.trim().split('\n').filter(l => l);
      const entry = JSON.parse(lines[lines.length - 1]);
      
      console.log('Latest:', JSON.stringify(entry, null, 2), '\n');
      
      if (entry.sessionId) pass(`Has sessionId: ${entry.sessionId.substring(0, 8)}...`);
      if (entry.component) pass(`Has component: ${entry.component}`);
      if (entry.action) pass(`Has action: ${entry.action}`);
      if (entry.loggedAt) {
        pass(`Has timestamp: ${entry.loggedAt}`);
        if (!isNaN(new Date(entry.loggedAt).getTime())) {
          pass('Timestamp is valid ISO 8601');
        }
      }
      
      lastSize = currentSize;
      
      if (testsPassed >= 4) {
        console.log('\n✅ Tauri app interactions validated!\n');
        clearInterval(checkInterval);
        printSummary();
        process.exit(0);
      }
    }
  }
}, 1000);

function printSummary() {
  console.log('═══════════════════════════════════════');
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  
  if (testsPassed === 0) {
    console.log('\n⚠️  No interactions detected!');
    console.log('\nTroubleshooting:');
    console.log('1. Check: tail -f /tmp/backend-console.log');
    console.log('2. Look for "Client connected" messages');
    console.log('3. Right-click Tauri window -> Inspect -> Console tab');
  } else if (testsFailed === 0) {
    console.log('\n✅ Tauri logging works correctly!');
  }
  console.log('═══════════════════════════════════════\n');
}

process.on('SIGINT', () => {
  console.log('\n\nInterrupted\n');
  clearInterval(checkInterval);
  printSummary();
  process.exit(1);
});
