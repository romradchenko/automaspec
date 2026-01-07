Automaspec Analytics Report
Project: Automaspec
Document version: 1.1

1. Overview
Automaspec includes an Analytics Dashboard that summarizes test/spec health for the currently active organization. The dashboard is
implemented as a Next.js App Router page and is powered by a single oRPC endpoint that returns aggregated metrics.
Primary goals:
• Provide a quick “health snapshot” (counts + status distribution)
• Show growth over time (new tests created)
• Highlight stale specs (not updated recently)

2. UI (Analytics Dashboard)
Route: /analytics (app/analytics/page.tsx)
The page renders:
• Metrics cards: total tests, total requirements, total specs, active members
• Tests Growth chart: line chart of tests created per day for selected period
• Test Status Distribution chart: bar chart grouped by current test/spec status
• Stale Tests table: specs with updatedAt older than the selected period threshold
Period selector: 7d, 30d, 90d (tabs at the top of the page)

3. Backend (oRPC)
Endpoint: GET /rpc/analytics/metrics (orpc/routes/analytics.ts)
Input:
{ "period": "30d" }

Output (shape):
{
"totalTests": 0,
"totalRequirements": 0,
"totalSpecs": 0,
"activeMembers": 0,
"testsByStatus": { "passed": 0 },
"testsGrowth": [{ "date": "2026‐01‐01", "count": 0 }],
"staleTests": [{ "id": "spec‐id", "name": "Spec name", "updatedAt": "2026‐01‐01 00:00:00" }]
}

Auth behavior:
• Requires an authenticated session and an active organization (oRPC middleware).

4. Data Sources and Aggregations
Tables used (Drizzle ORM):
• test_spec (spec list, statuses, updatedAt)
• test_requirement (total requirement count, scoped via spec org)
• test (total test count, created-at timeline)
• member (active member count)
Computed metrics:
• testsByStatus: aggregated by summing test_spec.statuses across specs in the organization
• testsGrowth: counts tests created on each date within the selected time window
• staleTests: specs whose updatedAt is older than now ‐ periodDays
Period constants:

• ANALYTICS_PERIODS in lib/constants.ts maps 7d|30d|90d to day counts.

5. Charts and Components
UI visualization stack:
• Charts: Recharts (LineChart, BarChart)
• Wrapper components: components/ui/chart
• Status labels and colors: STATUS_CONFIGS and a local status-to-color mapping in the chart component

6. Error Handling and UX
• Loading state: centered loader while the analytics query is in-flight
• Error state: “Failed to load analytics” + error message when query fails
• Empty states: charts and tables show friendly “no data” placeholders

7. Verification Checklist
• Open /analytics while logged in with an active organization
• Switch between 7d, 30d, 90d tabs and confirm query updates
• Confirm totals match the dashboard data model for the organization
• Create a new test and confirm it appears in growth chart over time
• Ensure stale specs appear when updatedAt is older than the selected period window

