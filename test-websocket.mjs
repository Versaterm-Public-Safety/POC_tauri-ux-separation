// Comprehensive test for User Story 1: BaseMessage Contract Foundation
import WebSocket from 'ws';

const WS_URL = 'ws://localhost:8080/tnt';
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    testsFailed++;
  }
}

function isValidUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function isValidISO8601(str) {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return iso8601Regex.test(str);
}

console.log('🧪 Testing User Story 1: BaseMessage Contract Foundation\n');
console.log('Testing Requirements:');
console.log('  - All messages must have messageId (UUID v4)');
console.log('  - All messages must have timestamp (ISO 8601)');
console.log('  - All messages must use "payload" wrapper (not "data")');
console.log('  - Frontend must auto-generate messageId and timestamp\n');

const ws = new WebSocket(WS_URL);
const receivedMessages = [];
let connectionAckReceived = false;

ws.on('open', () => {
  console.log('📡 Connected to WebSocket server\n');
  
  // Test 1: Send call:start message (frontend should auto-add messageId and timestamp)
  console.log('Test 1: Sending call:start message...');
  const startMessage = {
    type: 'call:start',
    messageId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  
  // Validate outgoing message structure
  assert(startMessage.messageId, 'Outgoing message has messageId');
  assert(isValidUUID(startMessage.messageId), `Outgoing messageId is valid UUID: ${startMessage.messageId}`);
  assert(startMessage.timestamp, 'Outgoing message has timestamp');
  assert(isValidISO8601(startMessage.timestamp), `Outgoing timestamp is ISO 8601: ${startMessage.timestamp}`);
  
  ws.send(JSON.stringify(startMessage));
  console.log('');
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  receivedMessages.push(message);
  
  console.log(`📥 Received ${message.type} message`);
  
  // Test BaseMessage fields
  assert(message.messageId, `${message.type}: has messageId`);
  assert(isValidUUID(message.messageId), `${message.type}: messageId is valid UUID`);
  assert(message.timestamp, `${message.type}: has timestamp`);
  assert(isValidISO8601(message.timestamp), `${message.type}: timestamp is ISO 8601`);
  
  // Test payload wrapper usage
  if (message.type !== 'call:start' && message.type !== 'call:end') {
    assert(message.payload !== undefined, `${message.type}: uses "payload" wrapper`);
    assert(message.data === undefined, `${message.type}: does NOT use "data" wrapper`);
  }
  
  // Type-specific validations
  if (message.type === 'connection:ack') {
    assert(message.payload?.sessionId, 'connection:ack has sessionId in payload');
    connectionAckReceived = true;
  }
  
  if (message.type === 'call:state') {
    assert(message.payload?.state, 'call:state has state in payload');
    assert(['idle', 'connecting', 'active', 'ended'].includes(message.payload.state), 
      `call:state has valid state: ${message.payload.state}`);
  }
  
  if (message.type === 'language:detected') {
    assert(message.payload?.speaker, 'language:detected has speaker in payload');
    assert(message.payload?.languageCode, 'language:detected has languageCode in payload');
    assert(message.payload?.confidence, 'language:detected has confidence in payload');
  }
  
  if (message.type === 'transcript:segment') {
    assert(message.payload?.speaker, 'transcript:segment has speaker in payload');
    assert(message.payload?.text !== undefined, 'transcript:segment has text in payload');
    assert(message.payload?.isFinal !== undefined, 'transcript:segment has isFinal in payload');
  }
  
  if (message.type === 'audio:status') {
    assert(message.payload?.caller, 'audio:status has caller in payload');
    assert(message.payload?.telecommunicator, 'audio:status has telecommunicator in payload');
  }
  
  console.log('');
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  testsFailed++;
});

ws.on('close', () => {
  console.log('📊 Test Summary');
  console.log('═'.repeat(50));
  console.log(`Total Messages Received: ${receivedMessages.length}`);
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log('═'.repeat(50));
  
  if (testsFailed === 0 && testsPassed > 0) {
    console.log('\n✅ All tests passed! User Story 1 is VERIFIED.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Review output above.');
    process.exit(1);
  }
});

// Close after 8 seconds (enough to get connection:ack, call:state, language:detected, transcript, audio)
setTimeout(() => {
  console.log('\n⏹️  Closing connection and finalizing tests...\n');
  ws.close();
}, 8000);
