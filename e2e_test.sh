#!/bin/bash
set -e
BASE="http://localhost:8000"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓ $1${NC}"; }
fail() { echo -e "${RED}✗ $1${NC}"; exit 1; }

echo "=== NEXUS END-TO-END TEST ==="
echo ""

# ── 1. Health check ──────────────────────────────────────────────────────────
echo "1. Health check..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE/health)
[ "$STATUS" = "200" ] || fail "Backend not reachable at $BASE (got $STATUS)"
pass "Backend up"

# ── 2. Create evaluator run ───────────────────────────────────────────────────
echo ""
echo "2. Create evaluator run..."
RUN=$(curl -s -X POST $BASE/api/v1/evaluator/runs \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"E2E Test Run\",\"cadence\":\"daily\",\"start_date\":\"$(date +%Y-%m-%d)\",\"status\":\"active\"}")
RUN_ID=$(echo $RUN | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
[ -n "$RUN_ID" ] || fail "Run creation failed: $RUN"
pass "Run created: $RUN_ID"

# ── 3. Create evaluator item ──────────────────────────────────────────────────
echo ""
echo "3. Create evaluator item..."
ITEM=$(curl -s -X POST $BASE/api/v1/evaluator/runs/$RUN_ID/items \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Fiber Sales Response\",\"input\":\"Customer asks: What makes your fiber better than AT&T?\",\"ai_output\":\"Our fiber delivers symmetrical gigabit speeds with 99.9% uptime SLA, no throttling, and local 24/7 support — unlike AT&T's shared bandwidth model.\",\"priority\":\"high\",\"task_status\":\"pending\"}")
ITEM_ID=$(echo $ITEM | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
[ -n "$ITEM_ID" ] || fail "Item creation failed: $ITEM"
pass "Item created: $ITEM_ID"

# ── 4. Submit score ───────────────────────────────────────────────────────────
echo ""
echo "4. Submit response score=5..."
RESP=$(curl -s -X POST $BASE/api/v1/evaluator/responses \
  -H "Content-Type: application/json" \
  -d "{\"run_id\":\"$RUN_ID\",\"item_id\":\"$ITEM_ID\",\"score\":5,\"evaluator_name\":\"Waqar Ahmad\",\"organization_name\":\"VectorTechSol\"}")
RESP_ID=$(echo $RESP | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
[ -n "$RESP_ID" ] || fail "Response failed: $RESP"
pass "Response saved: score=5"

# ── 5. Verify responses GET ───────────────────────────────────────────────────
echo ""
echo "5. Verify responses list..."
COUNT=$(curl -s $BASE/api/v1/evaluator/runs/$RUN_ID/responses | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")
[ "$COUNT" -ge 1 ] || fail "No responses returned"
pass "Responses: $COUNT record(s) found"

# ── 6. Sniper run (mock mode) ─────────────────────────────────────────────────
echo ""
echo "6. Create sniper run (mock mode)..."
SNIPER=$(curl -s -X POST $BASE/api/v1/sniper/runs \
  -H "Content-Type: application/json" \
  -d '{
    "source_object_type":"existing_nexus_lead",
    "source_object_id":"test-lead-001",
    "source_object_data":{
      "company_name":"AT&T Business Dallas",
      "address":"2000 Telecom Pkwy, Dallas TX 75252",
      "near_net_fiber":true,
      "provider":"AT&T",
      "contact_name":"John Smith",
      "phone":"+1-214-555-0100"
    },
    "target_object_type":"business",
    "geo_filter":"Dallas, TX",
    "mock_mode":true
  }')
SNIPER_ID=$(echo $SNIPER | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('run_uuid',''))")
[ -n "$SNIPER_ID" ] || fail "Sniper run failed: $SNIPER"
pass "Sniper run created: $SNIPER_ID"

# ── 7. Poll sniper timeline ───────────────────────────────────────────────────
echo ""
echo "7. Poll sniper timeline (max 30s)..."
for i in $(seq 1 12); do
  TLINE=$(curl -s $BASE/api/v1/sniper/runs/$SNIPER_ID/timeline)
  STATUS=$(echo $TLINE | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status',''))" 2>/dev/null)
  STEPS=$(echo $TLINE | python3 -c "import sys,json; d=json.load(sys.stdin); steps=d.get('steps',[]); done=[s for s in steps if s.get('status')=='completed']; print(f'{len(done)}/{len(steps)}')" 2>/dev/null)
  echo "   → status=$STATUS steps=$STEPS"
  [ "$STATUS" = "completed" ] && break
  [ "$STATUS" = "failed" ] && fail "Sniper run failed"
  sleep 3
done
[ "$STATUS" = "completed" ] || fail "Sniper did not complete in time"
pass "Sniper pipeline completed"

# ── 8. Get sniper results ─────────────────────────────────────────────────────
echo ""
echo "8. Get sniper results..."
RESULTS=$(curl -s $BASE/api/v1/sniper/runs/$SNIPER_ID/results)
MATCHES=$(echo $RESULTS | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('matches',[])))" 2>/dev/null)
[ "$MATCHES" -ge 1 ] || fail "No matches returned"
pass "Matches returned: $MATCHES"

echo ""
echo "=== ALL TESTS PASSED ==="
echo ""
echo "Records created:"
echo "  Evaluator Run ID : $RUN_ID"
echo "  Evaluator Item ID: $ITEM_ID"
echo "  Sniper Run UUID  : $SNIPER_ID"
echo ""
echo "View in UI:"
echo "  http://localhost:3000/evaluator"
echo "  http://localhost:3000/evaluator/analytics"
echo "  http://localhost:3000/demo/universal-intent-modal"
