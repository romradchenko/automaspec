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

if echo "$AUTH_RESPONSE" | grep -q '"user"'; then
  echo "✅ Авторизация успешна"
else
  echo "❌ Ошибка авторизации: $AUTH_RESPONSE"
  exit 1
fi

echo ""
echo "📋 Получаю список организаций..."

ORGS_RESPONSE=$(curl -s -c "$COOKIES_FILE" -b "$COOKIES_FILE" \
  -X GET "$BASE_URL/api/auth/organization/list" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL")

ORG_ID=$(echo "$ORGS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ORG_ID" ]; then
  echo "❌ Организация не найдена"
  exit 1
fi

echo "✅ Выбрана организация: $ORG_ID"

echo ""
echo "🔄 Устанавливаю активную организацию..."

curl -s -c "$COOKIES_FILE" -b "$COOKIES_FILE" \
  -X POST "$BASE_URL/api/auth/organization/set-active" \
  -H "Content-Type: application/json" \
  -H "Origin: $BASE_URL" \
  -d "{\"organizationId\":\"$ORG_ID\"}" > /dev/null

rpc_call() {
  local path="$1"
  local data="$2"
  local method="${3:-POST}"
  
  curl -s -c "$COOKIES_FILE" -b "$COOKIES_FILE" \
    -X "$method" "$BASE_URL/rpc$path" \
    -H "Content-Type: application/json" \
    -H "Origin: $BASE_URL" \
    -d "$data"
}

create_folder() {
  local id="$1"
  local name="$2"
  local parent_id="$3"
  
  local data
  if [ -z "$parent_id" ]; then
    data="{\"id\":\"$id\",\"name\":\"$name\",\"organizationId\":\"$ORG_ID\"}"
  else
    data="{\"id\":\"$id\",\"name\":\"$name\",\"organizationId\":\"$ORG_ID\",\"parentFolderId\":\"$parent_id\"}"
  fi
  
  echo "  📁 Создаю папку: $name"
  rpc_call "/test-folders/$id" "$data" "POST" > /dev/null
  echo "$id"
}

create_spec() {
  local id="$1"
  local name="$2"
  local file_name="$3"
  local folder_id="$4"
  
  local data="{\"id\":\"$id\",\"name\":\"$name\",\"fileName\":\"$file_name\",\"folderId\":\"$folder_id\"}"
  
  echo "  📄 Создаю спецификацию: $name"
  rpc_call "/test-specs/$id" "$data" "PUT" > /dev/null
  echo "$id"
}

create_requirement() {
  local id="$1"
  local name="$2"
  local spec_id="$3"
  local order="$4"
  
  local data="{\"id\":\"$id\",\"name\":\"$name\",\"specId\":\"$spec_id\"}"
  
  echo "    ✓ $name"
  rpc_call "/test-requirements/$id" "$data" "PUT" > /dev/null
}

echo ""
echo "🚀 Создаю структуру тестов..."
echo ""

echo "=== Папка: Components ==="
COMPONENTS_FOLDER_ID=$(create_folder "folder-components" "Components")

echo ""
echo "--- Spec: Test Details Panel ---"
SPEC_DETAILS_ID=$(create_spec "spec-test-details-panel" "Test Details Panel" "test-details-panel.test.tsx" "$COMPONENTS_FOLDER_ID")
create_requirement "req-display-spec-details" "should display test spec details" "$SPEC_DETAILS_ID" 0
create_requirement "req-display-statistics" "should display test statistics" "$SPEC_DETAILS_ID" 1
create_requirement "req-handle-no-spec" "should handle no spec selected" "$SPEC_DETAILS_ID" 2

echo ""
echo "--- Spec: Tree Component ---"
SPEC_TREE_COMP_ID=$(create_spec "spec-tree-component" "Tree Component" "tree-display.test.ts" "$COMPONENTS_FOLDER_ID")
create_requirement "req-tree-display-folders" "should display test folders in tree structure" "$SPEC_TREE_COMP_ID" 0

echo ""
echo "--- Spec: Dashboard Tree View ---"
SPEC_DASHBOARD_TREE_ID=$(create_spec "spec-dashboard-tree" "Dashboard Tree View" "tree.test.tsx" "$COMPONENTS_FOLDER_ID")
create_requirement "req-dashboard-tree-folders" "should display test folders in tree structure" "$SPEC_DASHBOARD_TREE_ID" 0
create_requirement "req-dashboard-empty-folders" "should handle empty folders array" "$SPEC_DASHBOARD_TREE_ID" 1
create_requirement "req-dashboard-specs-in-folders" "should display specs in folders" "$SPEC_DASHBOARD_TREE_ID" 2

echo ""
echo "=== Папка: Database ==="
DATABASE_FOLDER_ID=$(create_folder "folder-database" "Database")

echo ""
echo "--- Spec: Database Schema - Test Tables ---"
SPEC_TEST_TABLES_ID=$(create_spec "spec-db-test-tables" "Database Schema - Test Tables" "schema.test.ts" "$DATABASE_FOLDER_ID")
create_requirement "req-testfolder-table" "should have testFolder table defined" "$SPEC_TEST_TABLES_ID" 0
create_requirement "req-testspec-table" "should have testSpec table defined" "$SPEC_TEST_TABLES_ID" 1
create_requirement "req-testrequirement-table" "should have testRequirement table defined" "$SPEC_TEST_TABLES_ID" 2
create_requirement "req-test-table" "should have test table defined" "$SPEC_TEST_TABLES_ID" 3

echo ""
echo "--- Spec: Database Schema - Auth Tables ---"
SPEC_AUTH_TABLES_ID=$(create_spec "spec-db-auth-tables" "Database Schema - Auth Tables" "schema.test.ts" "$DATABASE_FOLDER_ID")
create_requirement "req-user-table" "should have user table defined" "$SPEC_AUTH_TABLES_ID" 0
create_requirement "req-organization-table" "should have organization table defined" "$SPEC_AUTH_TABLES_ID" 1
create_requirement "req-member-table" "should have member table defined" "$SPEC_AUTH_TABLES_ID" 2

echo ""
echo "--- Spec: Database Schema - Table Columns ---"
SPEC_TABLE_COLUMNS_ID=$(create_spec "spec-db-table-columns" "Database Schema - Table Columns" "schema.test.ts" "$DATABASE_FOLDER_ID")
create_requirement "req-testfolder-columns" "testFolder should have required columns" "$SPEC_TABLE_COLUMNS_ID" 0
create_requirement "req-testspec-columns" "testSpec should have required columns" "$SPEC_TABLE_COLUMNS_ID" 1
create_requirement "req-test-columns" "test should have required columns" "$SPEC_TABLE_COLUMNS_ID" 2

echo ""
echo "✅ Структура тестов создана успешно!"
echo ""
echo "📊 Итого:"
echo "  - 2 папки (Components, Database)"
echo "  - 6 спецификаций"
echo "  - 15 требований"
