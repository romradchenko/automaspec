#!/bin/bash

set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"
EMAIL="${EMAIL:-demo@automaspec.com}"
PASSWORD="${PASSWORD:-demo1234}"

COOKIES_FILE=$(mktemp)
trap "rm -f $COOKIES_FILE" EXIT

echo "🔐 Авторизация как $EMAIL..."

AUTH_RESPONSE=$(curl -s -c "$COOKIES_FILE" -b "$COOKIES_FILE" \
  -X POST "$BASE_URL/api/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "Auth response: $AUTH_RESPONSE"

if echo "$AUTH_RESPONSE" | grep -q '"user"'; then
  echo "✅ Авторизация успешна"
else
  echo "❌ Ошибка авторизации"
  exit 1
fi

echo ""
echo "📋 Получаю список организаций..."

ORGS_RESPONSE=$(curl -s -c "$COOKIES_FILE" -b "$COOKIES_FILE" \
  -X GET "$BASE_URL/api/auth/organization/list" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL")

echo "Organizations: $ORGS_RESPONSE"

ORG_ID=$(echo "$ORGS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ORG_ID" ]; then
  echo "❌ Организация не найдена"
  exit 1
fi

echo "✅ Выбрана организация: $ORG_ID"

echo ""
echo "🔄 Устанавливаю активную организацию..."

SET_ORG_RESPONSE=$(curl -s -c "$COOKIES_FILE" -b "$COOKIES_FILE" \
  -X POST "$BASE_URL/api/auth/organization/set-active" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{\"organizationId\":\"$ORG_ID\"}")

echo "Set org response: $SET_ORG_RESPONSE"

echo ""
echo "🚀 Вызываю syncReport..."

SYNC_RESPONSE=$(curl -s -c "$COOKIES_FILE" -b "$COOKIES_FILE" \
  -X POST "$BASE_URL/rpc/tests/sync-report" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{}")

echo ""
echo "📊 Результат syncReport:"
echo "$SYNC_RESPONSE"
