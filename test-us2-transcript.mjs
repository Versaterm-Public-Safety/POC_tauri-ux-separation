// Test for User Story 2: Transcript Segment Tracking
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

console.log('🧪 Testing User Story 2: Transcript Segment Tracking\n');
console.log('Testing Requirements:');
console.log('  - Each transcript segment must have segmentId (UUID v4)');
console.log('  - Each segment must have startTime (call-relative seconds)');
console.log('  - startTime values should increase monotonically');
console.log('  - Interim segments (isFinal=false) should NOT have endTime');
console.log('  - Final segments (isFinal=true) SHOULD have endTime\n');

const ws = new WebSocket(WS_URL);
const transcriptSegments = [];
let lastStartTime = -1;

ws.on('open', () => {
  console.log('📡 Connected to WebSocket server\n');
  
  // Send call:start to trigger conversation
  const startMessage = {
    type: 'call:start',
    messageId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  
  ws.send(JSON.stringify(startMessage));
  console.log('📤 Sent call:start message\n');
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  
  if (message.type === 'transcript:segment') {
    const segment = message.payload;
    transcriptSegments.push(segment);
    
    console.log(`📝 Transcript #${transcriptSegments.length}: ${segment.speaker} - "${segment.text.substring(0, 30)}..."`);
    
    // Test segmentId
    assert(segment.segmentId, `Segment has segmentId`);
    assert(isValidUUID(segment.segmentId), `segmentId is valid UUID: ${segment.segmentId}`);
    
    // Test startTime
    assert(segment.startTime !== undefined, `Segment has startTime`);
    assert(typeof segment.startTime === 'number', `startTime is a number: ${segment.startTime}`);
    assert(segment.startTime >= 0, `startTime is non-negative: ${segment.startTime}s`);
    
    // Test monotonic increase (with some tolerance for timing variations)
    if (lastStartTime >= 0) {
      assert(segment.startTime >= lastStartTime - 0.1, 
        `startTime increases monotonically: ${segment.startTime}s >= ${lastStartTime}s`);
    }
    lastStartTime = segment.startTime;
    
    // Test endTime based on isFinal
    if (segment.isFinal) {
      assert(segment.endTime !== undefined, `Final segment HAS endTime: ${segment.endTime}s`);
      if (segment.endTime !== undefined) {
        assert(segment.endTime >= segment.startTime, 
          `endTime (${segment.endTime}s) >= startTime (${segment.startTime}s)`);
      }
    } else {
      assert(segment.endTime === undefined, 
        `Interim segment does NOT have endTime (value: ${segment.endTime})`);
    }
    
    console.log(`   ├─ segmentId: ${segment.segmentId.substring(0, 8)}...`);
    console.log(`   ├─ startTime: ${segment.startTime.toFixed(3)}s`);
    console.log(`   ├─ endTime: ${segment.endTime ? segment.endTime.toFixed(3) + 's' : 'none (interim)'}`);
    console.log(`   └─ isFinal: ${segment.isFinal}\n`);
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
  console.log(`Total Transcript Segments Received: ${transcriptSegments.length}`);
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log('═'.repeat(60));
  
  // Additional summary statistics
  const finalSegments = transcriptSegments.filter(s => s.isFinal);
  const interimSegments = transcriptSegments.filter(s => !s.isFinal);
  
  console.log(`\nSegment Breakdown:`);
  console.log(`  Final segments: ${finalSegments.length}`);
  console.log(`  Interim segments: ${interimSegments.length}`);
  
  if (transcriptSegments.length > 0) {
    const firstTime = transcriptSegments[0].startTime;
    const lastTime = transcriptSegments[transcriptSegments.length - 1].startTime;
    console.log(`  Time range: ${firstTime.toFixed(3)}s - ${lastTime.toFixed(3)}s`);
  }
  
  console.log('');
  
  if (testsFailed === 0 && testsPassed > 0) {
    console.log('✅ All tests passed! User Story 2 is VERIFIED.\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Review output above.\n');
    process.exit(1);
  }
});

// Close after 16 seconds (enough to get all conversation segments)
setTimeout(() => {
  console.log('⏹️  Closing connection and finalizing tests...\n');
  ws.close();
}, 16000);
