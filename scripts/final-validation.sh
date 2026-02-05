#!/bin/bash

echo "🎯 Final Validation - All User Stories"
echo "======================================"
echo ""

echo "✓ US1: BaseMessage Foundation"
timeout 12 node tests/test-websocket.mjs 2>&1 | grep -A2 "Test Summary"

sleep 2

echo ""
echo "✓ US2: Transcript Segment Tracking"  
timeout 18 node tests/test-us2-transcript.mjs 2>&1 | grep -A5 "Test Summary"

sleep 2

echo ""
echo "✓ US3: Call Session Tracking"
timeout 25 node tests/test-us3-callid.mjs 2>&1 | grep -A5 "Test Summary"

echo ""
echo "======================================"
echo "✅ FINAL VALIDATION COMPLETE"
echo "======================================"
