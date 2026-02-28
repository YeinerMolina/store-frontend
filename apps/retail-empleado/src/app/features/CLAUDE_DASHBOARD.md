# Feature: Dashboard

> Feature path: `features/dashboard/`

## UX Screen

Basic Dashboard (§4.2 of UX)

## Route

`/dashboard` — default after login

## Description

Initial post-login view. Total active products, low stock products, recent movements.

## Structure

```
dashboard/
├── dashboard-page/
│   ├── dashboard-page.component.ts/html/scss
├── components/
│   ├── stats-card/           # Card showing a metric (count + label)
│   ├── low-stock-alert/      # List of products below stock threshold
│   └── recent-movements/     # Latest inventory movements table
└── dashboard.routes.ts
```

## Page Component

**`DashboardPageComponent`** — fetches stats data, manages loading/error states.

## Internal Components

### `StatsCardComponent`

Presentational. Receives title + value + icon via input.

### `LowStockAlertComponent`

Receives low-stock product list via input. Shows name + current stock + availability badge.

### `RecentMovementsComponent`

Receives movements list via input. Shows table with date, product, type, quantity.

## Shared Dependencies

| Dependency | Library |
|------------|---------|
| `LoadingSkeletonComponent` | `@retail/shared/ui` |
| `ErrorStateComponent` | `@retail/shared/ui` |
| `ProductosApiService` | `@retail/shared/data-access` |
| `InventarioApiService` | `@retail/shared/data-access` |

## State

No local store. Page component fetches on init.

## Cross-References

- [`../../../CLAUDE.md`](../../../CLAUDE.md) — app-level docs
- [`CLAUDE_INVENTARIO.md`](CLAUDE_INVENTARIO.md) — movements data
