// Test for User Story 3: Call Session Tracking
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

console.log('🧪 Testing User Story 3: Call Session Tracking\n');
console.log('Testing Requirements:');
console.log('  - Each call must have a unique callId (UUID v4)');
console.log('  - callId must appear in "active" state message');
console.log('  - callId must appear in "ended" state message');
console.log('  - Same callId must be used for both active and ended states');
console.log('  - "idle" and "connecting" states must NOT have callId');
console.log('  - Sequential calls must have different callIds\n');

const ws = new WebSocket(WS_URL);
const callStates = [];
let currentCallId = null;
let previousCallId = null;
let callCount = 0;

ws.on('open', () => {
  console.log('📡 Connected to WebSocket server\n');
  
  // Start first call
  console.log('📞 Starting Call #1...\n');
  const startMessage = {
    type: 'call:start',
    messageId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  ws.send(JSON.stringify(startMessage));
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  
  if (message.type === 'call:state') {
    const state = message.payload;
    callStates.push(state);
    
    console.log(`📊 Call State: ${state.state.toUpperCase()}`);
    
    // Test based on state
    switch (state.state) {
      case 'idle':
        assert(state.callId === undefined, `"idle" state has NO callId (value: ${state.callId})`);
        console.log('   └─ callId: none (expected for idle)\n');
        
        // If we've completed a call, start another one
        if (callCount === 1 && previousCallId) {
          console.log('📞 Starting Call #2 (to test different callIds)...\n');
          callCount++;
          const startMessage = {
            type: 'call:start',
            messageId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          };
          ws.send(JSON.stringify(startMessage));
        }
        break;
        
      case 'connecting':
        assert(state.callId === undefined, `"connecting" state has NO callId (value: ${state.callId})`);
        console.log('   └─ callId: none (expected for connecting)\n');
        break;
        
      case 'active':
        assert(state.callId !== undefined, `"active" state HAS callId`);
        assert(isValidUUID(state.callId), `callId is valid UUID: ${state.callId}`);
        
        currentCallId = state.callId;
        console.log(`   ├─ callId: ${currentCallId}`);
        console.log(`   └─ Call #${callCount + 1} is now active\n`);
        
        // End call after 2 seconds
        setTimeout(() => {
          if (callCount < 2) {
            console.log(`🛑 Ending Call #${callCount + 1}...\n`);
            const endMessage = {
              type: 'call:end',
              messageId: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            };
            ws.send(JSON.stringify(endMessage));
          }
        }, 2000);
        break;
        
      case 'ended':
        assert(state.callId !== undefined, `"ended" state HAS callId`);
        assert(isValidUUID(state.callId), `callId is valid UUID: ${state.callId}`);
        assert(state.callId === currentCallId, 
          `"ended" callId matches "active" callId: ${state.callId} === ${currentCallId}`);
        
        console.log(`   ├─ callId: ${state.callId}`);
        console.log(`   ├─ Matches active state: ${state.callId === currentCallId ? 'YES' : 'NO'}`);
        
        // Check if different from previous call
        if (previousCallId) {
          assert(state.callId !== previousCallId, 
            `Call #${callCount + 1} has different callId than Call #${callCount}: ${state.callId} !== ${previousCallId}`);
          console.log(`   ├─ Different from previous call: ${state.callId !== previousCallId ? 'YES' : 'NO'}`);
        }
        
        previousCallId = state.callId;
        callCount++;
        currentCallId = null;
        console.log(`   └─ Call #${callCount} ended\n`);
        
        // Close connection after second call
        if (callCount >= 2) {
          setTimeout(() => {
            console.log('⏹️  All calls completed. Closing connection...\n');
            ws.close();
          }, 3000);
        }
        break;
    }
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  testsFailed++;
});

ws.on('close', () => {
  console.log('═'.repeat(60));
  console.log('📊 Test Summary');
  console.log('═'.repeat(60));
  console.log(`Total Call State Messages: ${callStates.length}`);
  console.log(`Calls Completed: ${callCount}`);
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log('═'.repeat(60));
  
  console.log('\nCall State Breakdown:');
  const statesByType = callStates.reduce((acc, state) => {
    acc[state.state] = (acc[state.state] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(statesByType).forEach(([state, count]) => {
    console.log(`  ${state}: ${count}`);
  });
  
  console.log('');
  
  if (testsFailed === 0 && testsPassed > 0 && callCount >= 2) {
    console.log('✅ All tests passed! User Story 3 is VERIFIED.\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed or insufficient calls. Review output above.\n');
    process.exit(1);
  }
});

// Safety timeout
setTimeout(() => {
  console.log('⏱️  Test timeout - closing connection\n');
  ws.close();
}, 25000);
