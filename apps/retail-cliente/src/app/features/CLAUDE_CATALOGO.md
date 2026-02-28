# Feature: `features/catalogo/` — Catalog Exploration

## UX Screens
- Catalog with filters (3.1.1)
- Product Detail (3.1.2)
- Package Detail
- Category Page

## Routes
- `/catalogo` — main catalog listing
- `/catalogo/producto/:id` — single product detail
- `/catalogo/paquete/:id` — package detail with component list
- `/catalogo/categoria/:id` — category-filtered catalog

## Description
Full catalog exploration with filters, pagination, sorting. Most complex client feature.

## Structure
```
catalogo/
├── catalogo-page/              # Main catalog listing
│   ├── catalogo-page.component.ts
│   ├── catalogo-page.component.html
│   └── catalogo-page.component.scss
├── producto-detail-page/       # Single product detail
├── paquete-detail-page/        # Package detail with component list
├── categoria-page/             # Category-filtered catalog
├── components/
│   ├── product-filters/        # Sidebar/drawer with category, price, availability filters
│   ├── product-grid/           # Responsive grid of ProductCards
│   └── sort-selector/          # Dropdown for sorting
├── services/
│   └── catalogo-filter.store.ts  # Local filter state
└── catalogo.routes.ts
```

## Page Components
- `CatalogoPageComponent`: Injects ProductosApiService + CatalogoFilterStore, loads data, manages loading/error/empty states. Main catalog listing with filters and pagination.
- `ProductoDetailPageComponent`: Receives `:id` from route, loads full product detail. Shows image gallery, price, availability, description.
- `PaqueteDetailPageComponent`: Similar to product detail but shows package components list.
- `CategoriaPageComponent`: Can reuse CatalogoPage with pre-applied category filter.

## Internal Components
- `ProductFiltersComponent`: sidebar/drawer with filters for category, price range, availability. Emits filter changes.
- `ProductGridComponent`: responsive grid rendering ProductCards. Receives product array via input.
- `SortSelectorComponent`: dropdown for ordering (price, name, recent). Emits sort changes.

## Local Store
`CatalogoFilterStore` — NOT providedIn root, local to the feature.

Contains:
- Signal for active filters (`ListarProductosParams`): page, pageSize, categoriaId, disponibilidad, precioMin, precioMax, busqueda, ordenarPor, ordenDireccion
- Computed: `hayFiltrosActivos`
- Actions: actualizarFiltro, limpiarFiltros, cambiarPagina

## Shared Dependencies
- `@retail/shared/ui`: ProductCardComponent, PriceDisplayComponent, AvailabilityBadgeComponent, ImageGalleryComponent, PaginationComponent, LoadingSkeletonComponent, EmptyStateComponent
- `@retail/shared/data-access`: ProductosApiService, PaquetesApiService, CategoriasApiService
- `@retail/shared/domain`: ProductoResumen, ProductoDetalle, PaqueteDetalle, Categoria, Disponibilidad, EstadoProducto, ListarProductosParams, PaginatedResponse
- `@retail/shared/util`: formatCurrencyCOP

## Route Configuration
```typescript
export const catalogoRoutes: Routes = [
  { path: '', component: CatalogoPageComponent },
  { path: 'producto/:id', component: ProductoDetailPageComponent },
  { path: 'paquete/:id', component: PaqueteDetailPageComponent },
  { path: 'categoria/:id', component: CategoriaPageComponent },
];
```

## Cross-References
- `../../../CLAUDE.md` (app)
- `../../../../CLAUDE.md` (workspace)
- `CLAUDE_HOME.md` (home links to catalog)
