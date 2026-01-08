#!/bin/bash

# Скрипт для тестирования syncReport локально
# Использование: ./scripts/test-sync-report.sh

BASE_URL="${BASE_URL:-http://localhost:3000}"
EMAIL="demo@automaspec.com"
PASSWORD="demo1234"
COOKIE_FILE="/tmp/automaspec-cookies.txt"

echo "🔐 Авторизация как $EMAIL..."

# 1. Авторизация через better-auth
AUTH_RESPONSE=$(curl -s -c "$COOKIE_FILE" -b "$COOKIE_FILE" \
  -X POST "$BASE_URL/api/auth/sign-in/email" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

echo "Auth response: $AUTH_RESPONSE"

# Проверяем успешность
if echo "$AUTH_RESPONSE" | grep -q "error"; then
  echo "❌ Ошибка авторизации"
  exit 1
fi

echo "✅ Авторизация успешна"

# 2. Получаем список организаций чтобы выбрать активную
echo ""
echo "📋 Получаю список организаций..."

ORG_LIST=$(curl -s -b "$COOKIE_FILE" \
  -H "Origin: $BASE_URL" \
  -X GET "$BASE_URL/api/auth/organization/list")

echo "Organizations: $ORG_LIST"

# Берём первую организацию
ORG_ID=$(echo "$ORG_LIST" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"//;s/"//')

if [ -z "$ORG_ID" ]; then
  echo "❌ Организации не найдены"
  exit 1
fi

echo "✅ Выбрана организация: $ORG_ID"

# 3. Устанавливаем активную организацию
echo ""
echo "🔄 Устанавливаю активную организацию..."

SET_ORG=$(curl -s -c "$COOKIE_FILE" -b "$COOKIE_FILE" \
  -X POST "$BASE_URL/api/auth/organization/set-active" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{\"organizationId\": \"$ORG_ID\"}")

echo "Set org response: $SET_ORG"

# 4. Вызываем syncReport
echo ""
echo "🚀 Вызываю syncReport..."

SYNC_RESPONSE=$(curl -s -b "$COOKIE_FILE" \
  -X POST "$BASE_URL/rpc/tests/sync-report" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d @test-results.json)

echo ""
echo "📊 Результат syncReport:"
echo "$SYNC_RESPONSE"

# Cleanup
rm -f "$COOKIE_FILE"
