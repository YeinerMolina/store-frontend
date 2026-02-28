# retail-cliente — Public Storefront / Vitrina Pública

## App Identity

- **Name**: `retail-cliente`
- **Purpose**: Public storefront for customers to browse the product catalog, view details, and discover products
- **Audience**: General public (customers) — no login required
- **Authentication**: None in MVP. `/core/guards/` exists empty, prepared for client auth post-MVP
- **Port**: 4200 (dev)
- **Tags**: `scope:cliente`, `type:app`
- **Deployment**: Independent S3 + CloudFront distribution

## App Structure

```
src/app/
├── app.ts                 # Root component — <router-outlet />
├── app.config.ts          # provideRouter, provideHttpClient(withInterceptors([errorInterceptor])), API_BASE_URL
├── app.routes.ts          # Root routes: ShellComponent wraps all children with lazy loading
├── core/                  # Singleton services for this app
│   └── guards/            # Empty in MVP — prepared for client auth post-MVP
├── shell/                 # Main layout wrapper
│   ├── shell.component.*  # Layout: header + <router-outlet> + footer
│   ├── header/            # Top bar: logo, search, nav links
│   └── footer/            # Footer: store info, contact, links
└── features/              # Feature modules (see CLAUDE_*.md files)
    ├── home/              # → CLAUDE_HOME.md
    │   ├── home-page/
    │   ├── components/    # featured-products/, category-highlights/
    │   └── home.routes.ts
    ├── catalogo/          # → CLAUDE_CATALOGO.md (most complex feature)
    │   ├── catalogo-page/
    │   ├── producto-detail-page/
    │   ├── paquete-detail-page/
    │   ├── categoria-page/
    │   ├── components/    # product-filters/, product-grid/, sort-selector/
    │   ├── services/      # catalogo-filter.store.ts (signal-based local store)
    │   └── catalogo.routes.ts
    └── info/              # → CLAUDE_INFO.md
        ├── info-page/
        └── info.routes.ts
```

## App Config (`app.config.ts`)

- `provideZoneChangeDetection({ eventCoalescing: true })` — standard Angular 21
- `provideRouter(appRoutes)` — routes defined in `app.routes.ts`
- `provideHttpClient(withInterceptors([errorInterceptor]))` — NO `authInterceptor` (no login in MVP)
- `{ provide: API_BASE_URL, useValue: environment.apiBaseUrl }` — injected from `environments/`

**Key distinction vs retail-empleado**: No auth interceptor, no auth guard, no login flow.

## Shell

- `ShellComponent` wraps all routes — provides consistent header + footer layout
- **Header**: Logo, search bar (uses `SearchInputComponent` from `@retail/shared/ui`), navigation links to Home, Catálogo, Info
- **Footer**: Store information, contact details, useful links
- All feature routes render inside the shell's `<router-outlet />`

## Routing Pattern (`app.routes.ts`)

```typescript
Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '',        loadChildren: () => import('./features/home/home.routes')...     },
      { path: 'catalogo', loadChildren: () => import('./features/catalogo/catalogo.routes')... },
      { path: 'info',    loadChildren: () => import('./features/info/info.routes')...     },
    ],
  },
];
```

- All routes are children of `ShellComponent`
- Every feature is lazy-loaded via **relative imports** (not library paths)
- Designed for future additions: `/carrito`, `/mis-pedidos` post-MVP

## Shared Dependencies Consumed

| Library | What we use |
|---------|-------------|
| `@retail/shared/ui` | `ProductCard`, `PriceDisplay`, `AvailabilityBadge`, `LoadingSkeleton`, `EmptyState`, `ErrorState`, `ImageGallery`, `Pagination`, `SearchInput` |
| `@retail/shared/data-access` | `ProductosApiService`, `PaquetesApiService`, `CategoriasApiService`, `errorInterceptor`, `API_BASE_URL` token |
| `@retail/shared/domain` | All product/category models, enums (`DisponibilidadProducto`, `TipoProducto`), DTOs (`ListarProductosParams`) |
| `@retail/shared/util` | `formatCurrencyCOP`, `buildHttpParams` |
| `@retail/shared/styles` | SCSS variables, mixins, typography |

## UX Screen Mapping (from §11.1)

| Screen | Route | Page Component | Shared Components | Internal Components |
|--------|-------|----------------|-------------------|---------------------|
| Homepage | `/` | `HomePageComponent` | `ProductCard`, `SearchInput` | `FeaturedProducts`, `CategoryHighlights` |
| Catalog with filters | `/catalogo` | `CatalogoPageComponent` | `ProductCard`, `AvailabilityBadge`, `Pagination`, `LoadingSkeleton`, `EmptyState` | `ProductFilters`, `ProductGrid`, `SortSelector` |
| Product Detail | `/catalogo/producto/:id` | `ProductoDetailPageComponent` | `PriceDisplay`, `AvailabilityBadge`, `ImageGallery`, `LoadingSkeleton` | — |
| Package Detail | `/catalogo/paquete/:id` | `PaqueteDetailPageComponent` | `PriceDisplay`, `AvailabilityBadge`, `ImageGallery` | `ComponentList` |
| Category Page | `/catalogo/categoria/:id` | `CategoriaPageComponent` | (reuses `CatalogoPage` with pre-applied filter) | — |
| About Us | `/info` | `InfoPageComponent` | — | — |

## Cross-References

- **Root `../../CLAUDE.md`** — workspace conventions, Nx rules
- **Architecture (this app)** — `docs/CLAUDE_ARQUITECTURA.md` for app-specific architecture, features, routing, screen mapping
- **Architecture (shared)** — `docs/arquitectura/` (symlink to workspace `docs/`) for conventions, state, communication, errors, validations
- **Catalog walkthrough** — `docs/CLAUDE_ARQUITECTURA_CATALOGO.md` for step-by-step feature implementation example
- **Feature docs** — `src/app/features/CLAUDE_HOME.md`, `CLAUDE_CATALOGO.md`, `CLAUDE_INFO.md` for feature-specific details
- **Shared libraries** — `../../libs/shared/*/CLAUDE.md` for shared library implementation details

## MVP Alerts

1. **No client auth** — but `/core/guards/` exists and is ready for post-MVP authentication (client accounts, order history, etc.)
2. **SEO limitation** — Angular SPA without SSR is not SEO-friendly. Accepted for MVP. Evaluate Angular SSR (hydration) post-MVP.
3. **Responsive** — Mobile-first is **mandatory**. Target audience accesses primarily from mobile devices.
4. **Image lazy loading** — Use `LazyImageDirective` from `@retail/shared/ui` for all product images.
5. **No cart/checkout** — MVP is catalog-only (browse, filter, view details). Cart and checkout are post-MVP features.
