# Analytics & Reporting

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-11-20

### Context

The application requires comprehensive analytics and reporting capabilities to provide visibility into test coverage, status distribution, and team productivity. Users need dashboards to understand their testing progress at a glance.

### Decision

Implement a dedicated analytics module with:
- Real-time status aggregation from test data
- Visual charts for status distribution
- Time-series tracking for test growth
- Organization-level metrics

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Dashboard with key metrics | ✅ | Analytics page implemented |
| 2 | Test status distribution | ✅ | Pie/bar charts for passed/failed/pending |
| 3 | Coverage metrics | ✅ | Specs with tests vs total specs |
| 4 | Time-based trends | ✅ | Tests growth over time |
| 5 | Organization-level aggregation | ✅ | Data scoped to current org |
| 6 | Real-time updates | ✅ | Data refreshes on navigation |
| 7 | Responsive visualization | ✅ | Charts adapt to screen size |
| 8 | Export capabilities | ⚠️ | Planned for future |

## Implementation Details

### Analytics Architecture

```
Analytics Page
├── Status Distribution Chart
│   └── Aggregated test statuses (passed/failed/pending/skipped)
├── Coverage Metrics
│   └── Percentage of specs with tests
├── Tests Growth Chart
│   └── Cumulative test count over time
└── Summary Cards
    └── Total folders, specs, requirements, tests
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `analytics/page.tsx` | Main analytics dashboard |
| `StatusDistributionChart` | Visual breakdown of test statuses |
| `TestsGrowthChart` | Time-series line chart |
| `MetricCards` | Summary statistics |

### Data Flow

1. **Query**: oRPC procedure `analytics.getStats` fetches aggregated data
2. **Aggregation**: Server-side computation of metrics
3. **Visualization**: Recharts library renders interactive charts
4. **Caching**: React Query caches results for performance

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `analytics.getStats` | Returns aggregated statistics for organization |
| `analytics.getStatusDistribution` | Returns test status counts |
| `analytics.getTestsGrowth` | Returns time-series data |

### Technologies Used

| Technology | Purpose |
|------------|---------|
| Recharts | Chart visualization library |
| React Query | Data fetching and caching |
| oRPC | Type-safe API calls |
| TailwindCSS | Responsive styling |

## Screenshots

### Desktop View
![Analytics Dashboard](../../assets/screenshots/prod-analytics-desktop.png)

### Mobile View
![Analytics Mobile](../../assets/screenshots/prod-analytics-mobile.png)

## Limitations

1. **Historical Data**: Limited to data available in database
2. **Real-time**: Updates on page refresh, not WebSocket
3. **Export**: PDF/CSV export planned for future release

## Future Improvements

1. **Advanced Filtering**: Filter by date range, folder, spec
2. **Custom Reports**: User-defined report templates
3. **Scheduled Reports**: Email reports on schedule
4. **Comparative Analytics**: Compare periods, teams
