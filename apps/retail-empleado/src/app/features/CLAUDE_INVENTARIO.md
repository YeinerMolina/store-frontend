# Feature: Inventario

> Feature path: `features/inventario/`

## UX Screens

Inventory Management (§4.6)

## Routes

| Route | Description |
|-------|-------------|
| `/inventario` | Stock view with adjustment form |
| `/inventario/movimientos` | Movement history with filters |

## Description

Stock view per product, entry/adjustment registration, movement history.

## Structure

```
inventario/
├── inventario-page/           # Stock view with table + adjustment form
├── movimientos-page/          # Movement history with filters
├── components/
│   ├── stock-table/           # Table: product, available qty, reserved qty, availability badge
│   ├── ajuste-form/           # Form: product selector, quantity, type, reason
│   └── movimiento-history/    # Table: date, product, movement type, quantity, reason
└── inventario.routes.ts
```

## Page Components

### `InventarioPageComponent`

Shows stock table. Can open adjustment form to register entries/adjustments.

### `MovimientosPageComponent`

Movement history with date/type filters and pagination.

## Internal Components

### `StockTableComponent`

Table with product name, available qty, reserved qty, availability badge. Sortable.

### `AjusteFormComponent`

Form for registering inventory adjustments. Fields: product (select/autocomplete), quantity, adjustment type (operational/accounting), reason.

### `MovimientoHistoryComponent`

Filterable table of past movements.

## Validation Rules (from §10)

### Adjustment Form

| Field | Frontend | Backend |
|-------|----------|---------|
| Producto | required (select/autocomplete) | exists |
| Cantidad | required, integer, > 0 | sufficient stock (if outgoing) |
| Tipo ajuste | required (operativo/contable) | — |
| Motivo | required, min 10 chars | — |

## Shared Dependencies

| Dependency | Library |
|------------|---------|
| `AvailabilityBadgeComponent` | `@retail/shared/ui` |
| `PaginationComponent` | `@retail/shared/ui` |
| `ConfirmDialogComponent` | `@retail/shared/ui` |
| `InventarioApiService` | `@retail/shared/data-access` |
| `ProductosApiService` | `@retail/shared/data-access` |
| `StockProducto` | `@retail/shared/domain` |
| `MovimientoInventario` | `@retail/shared/domain` |
| `TipoMovimiento` | `@retail/shared/domain` |
| `TipoAjuste` | `@retail/shared/domain` |
| `Disponibilidad` | `@retail/shared/domain` |

## State

No local store in MVP. Pages fetch on init and after mutations.

## Cross-References

- [`../../../CLAUDE.md`](../../../CLAUDE.md) — app-level docs
- [`CLAUDE_PRODUCTOS.md`](CLAUDE_PRODUCTOS.md) — product relationship
- [`CLAUDE_DASHBOARD.md`](CLAUDE_DASHBOARD.md) — dashboard shows low stock
