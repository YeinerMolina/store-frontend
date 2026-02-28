# Feature: Productos

> Feature path: `features/productos/` — **THE LARGEST feature**

## UX Screens

- Product Management (§4.3)
- Package Management (§4.4)
- Category Management (§4.5)

## Routes

| Route | Description |
|-------|-------------|
| `/productos` | Product listing |
| `/productos/nuevo` | Create product |
| `/productos/:id/editar` | Edit product |
| `/paquetes` | Package listing |
| `/paquetes/nuevo` | Create package |
| `/paquetes/:id/editar` | Edit package |
| `/categorias` | Category listing |
| `/categorias/nueva` | Create category |
| `/categorias/:id/editar` | Edit category |

## Description

Full CRUD for products, packages, and categories.

## Structure

```
productos/
├── producto-list-page/        # Product listing with table, filters, actions
├── producto-form-page/        # Create/edit product form
├── paquete-list-page/         # Package listing
├── paquete-form-page/         # Create/edit package form
├── categoria-list-page/       # Category listing
├── categoria-form-page/       # Create/edit category form
├── components/
│   ├── product-table/         # Table with sorting, actions (edit, change status, delete)
│   ├── image-uploader/        # Upload product images (jpg/png/webp)
│   └── component-selector/    # Select products to add to a package with quantities
└── productos.routes.ts
```

## Page Components

### `ProductoListPageComponent`

Table of products with pagination, search, status filter. Actions: edit, change estado, delete (with confirm).

### `ProductoFormPageComponent`

Reactive form for create/edit. Fields: nombre, descripcion, precio, categoria, imagenes, esElegibleParaCambio, estado.

### `PaqueteListPageComponent`

Table of packages with pagination.

### `PaqueteFormPageComponent`

Form with nombre, precio, component selector (add products with quantities).

### `CategoriaListPageComponent`

Table with pagination, toggle activa.

### `CategoriaFormPageComponent`

Form with nombre, descripcion.

## Validation Rules (from §10)

### Product Form

| Field | Frontend | Backend |
|-------|----------|---------|
| Nombre | required, min 3, max 200 | uniqueness |
| Descripcion | required, max 2000 | — |
| Precio | required, > 0, numeric | positive (domain invariant) |
| Categoria | required (select) | exists and active |
| Imagenes | at least 1, formats jpg/png/webp, max size | processing + storage |
| Estado | required (select) | valid transition |

### Package Form

| Field | Frontend | Backend |
|-------|----------|---------|
| Nombre | required, min 3 | — |
| Precio | required, > 0 | positive |
| Componentes | at least 1, quantity > 0 each | products exist and active |

## Shared Dependencies

| Dependency | Library |
|------------|---------|
| `PriceDisplayComponent` | `@retail/shared/ui` |
| `AvailabilityBadgeComponent` | `@retail/shared/ui` |
| `ConfirmDialogComponent` | `@retail/shared/ui` |
| `PaginationComponent` | `@retail/shared/ui` |
| `ProductosApiService` | `@retail/shared/data-access` |
| `PaquetesApiService` | `@retail/shared/data-access` |
| `CategoriasApiService` | `@retail/shared/data-access` |

## State

No dedicated store in MVP. Forms use Reactive Forms. Lists re-fetch on changes.

## Splitting Alert

This feature is deliberately large. If it grows beyond ~10 components or 3 pages with very different logic, consider splitting into `features/productos`, `features/paquetes`, `features/categorias`. Splitting is cheap since these are internal directories.

## Cross-References

- [`../../../CLAUDE.md`](../../../CLAUDE.md) — app-level docs
- [`CLAUDE_INVENTARIO.md`](CLAUDE_INVENTARIO.md) — stock relationship
