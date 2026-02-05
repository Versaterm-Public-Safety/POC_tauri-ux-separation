// Test script to verify WebSocket message format
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('✅ Connected to backend');
  
  // Send a call:start message
  const startMessage = {
    type: 'call:start',
    messageId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  
  console.log('\n📤 Sending call:start:');
  console.log(JSON.stringify(startMessage, null, 2));
  ws.send(JSON.stringify(startMessage));
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('\n📥 Received message:');
  console.log(JSON.stringify(message, null, 2));
  
  // Validate message structure
  if (!message.messageId) {
    console.error('❌ Missing messageId');
  } else {
    console.log(`✅ messageId: ${message.messageId}`);
  }
  
  if (!message.timestamp) {
    console.error('❌ Missing timestamp');
  } else {
    console.log(`✅ timestamp: ${message.timestamp}`);
  }
  
  if (!message.payload && message.type !== 'call:start' && message.type !== 'call:end') {
    console.error('❌ Missing payload wrapper');
  } else if (message.payload) {
    console.log(`✅ Uses payload wrapper`);
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});

// Close after 10 seconds
setTimeout(() => {
  console.log('\n⏹️  Closing connection');
  ws.close();
  process.exit(0);
}, 10000);
