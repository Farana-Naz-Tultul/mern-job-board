#!/bin/bash

# ==============================
# Automated CRUD Test Script
# ==============================

# Test user credentials (must already exist in DB via /api/auth/register)
EMAIL="test@example.com"
PASSWORD="password123"

# 0. Login and grab token
echo "🔑 Logging in with $EMAIL ..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '(?<="token":")[^"]+')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Please register this user first with /api/auth/register."
  exit 1
fi

echo "✅ Got token: $TOKEN"
echo

# 1. Create a job
echo "🟢 Creating job..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Backend Developer","company":"TechCorp","description":"Build APIs with Node.js"}')

echo "Response: $CREATE_RESPONSE"
JOB_ID=$(echo $CREATE_RESPONSE | grep -oP '(?<="_id":")[^"]+')
echo "Created Job ID: $JOB_ID"
echo

# 2. Get all jobs
echo "🟢 Fetching jobs..."
curl -s -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer $TOKEN"
echo
echo

# 3. Update the job
echo "🟡 Updating job $JOB_ID..."
curl -s -X PATCH http://localhost:5000/api/jobs/$JOB_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Senior Backend Developer","company":"TechCorp International","description":"Lead API development"}'
echo
echo

# 4. Delete the job
echo "🔴 Deleting job $JOB_ID..."
curl -s -X DELETE http://localhost:5000/api/jobs/$JOB_ID \
  -H "Authorization: Bearer $TOKEN"
echo
