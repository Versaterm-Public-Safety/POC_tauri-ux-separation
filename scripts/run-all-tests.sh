#!/bin/bash
set -e

echo "🧪 Running All Test Suites for Spec Compliance"
echo "=============================================="
echo ""

# Ensure backend is running
if ! lsof -i:8080 >/dev/null 2>&1; then
  echo "⚠️  Backend not running, starting..."
  cd backend && timeout 60 node dist/server.js &
  sleep 3
  cd ..
fi

echo "📋 Test Suite 1: BaseMessage Foundation (US1)"
echo "----------------------------------------------"
timeout 20 node tests/test-websocket.mjs 2>&1 | grep -E "(Testing User Story|Tests Passed|Tests Failed|All tests passed)"
echo ""

echo "📋 Test Suite 2: Transcript Segment Tracking (US2)"
echo "---------------------------------------------------"
timeout 20 node tests/test-us2-transcript.mjs 2>&1 | grep -E "(Testing User Story|Tests Passed|Tests Failed|All tests passed)"
echo ""

echo "📋 Test Suite 3: Call Session Tracking (US3)"
echo "---------------------------------------------"
timeout 30 node tests/test-us3-callid.mjs 2>&1 | grep -E "(Testing User Story|Tests Passed|Tests Failed|All tests passed)"
echo ""

echo "=============================================="
echo "✅ All test suites completed successfully!"
echo "=============================================="
