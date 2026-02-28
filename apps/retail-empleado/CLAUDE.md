# retail-empleado — Backoffice / Management Application

## App Identity

- **Name**: `retail-empleado`
- **Purpose**: Backoffice / management application
- **Audience**: Employees (all profiles)
- **Auth**: JWT authentication required (mandatory for all routes except /login)
- **Port**: 4201 (dev)
- **Tags**: `scope:empleado`, `type:app`
- **Deploy**: Independently to its own S3+CloudFront

## App Structure

```
src/app/
├── app.component.ts
├── app.config.ts          # provideRouter, provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])), API_BASE_URL
├── app.routes.ts          # Root routes with lazy loading + authGuard
├── core/                  # Singleton services for this app
│   └── guards/
│       └── auth.guard.ts  # Verifies JWT before each route
├── shell/                 # Main layout
│   ├── shell.component.*  # Layout: sidebar + header + content
│   ├── sidebar/           # Lateral navigation
│   └── header/            # Top bar: user info, logout
└── features/              # See CLAUDE_*.md files
    ├── login/             # → CLAUDE_LOGIN.md
    ├── dashboard/         # → CLAUDE_DASHBOARD.md
    ├── productos/         # → CLAUDE_PRODUCTOS.md
    ├── inventario/        # → CLAUDE_INVENTARIO.md
    └── configuracion/     # → CLAUDE_CONFIGURACION.md
```

## App Config

- Uses `provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))` — BOTH interceptors
- `authInterceptor`: adds Bearer token to all requests when authenticated
- `errorInterceptor`: 401 → clears auth + redirects to /login, others propagate
- `API_BASE_URL` injected from environment

## Shell

- ShellComponent wraps authenticated routes with sidebar + header layout
- Sidebar: navigation links (Dashboard, Productos, Paquetes, Categorías, Inventario, Configuración)
- Header: user name, logout button
- Login route is OUTSIDE the shell (no sidebar/header on login page)

## Authentication Flow

- `authGuard` protects all routes inside the shell
- Login page is the only accessible route without JWT
- AuthStore (from `@retail/shared/data-access`) manages auth state with signals
- JWT stored in HttpOnly cookies (backend sends them), NOT in localStorage
- AuthStore only stores "is authenticated" state for UI, not the raw token

## Routing Pattern

- `/login` → login (lazy, NO shell, NO guard)
- `/` → shell (with authGuard) → children:
  - `''` redirects to `dashboard`
  - `dashboard` → dashboard (lazy)
  - `productos` → productos (lazy) — handles products, packages, categories CRUD
  - `inventario` → inventario (lazy)
  - `configuracion` → configuracion (lazy)

## Shared Dependencies Consumed

- `@retail/shared/ui`: PriceDisplay, AvailabilityBadge, LoadingSkeleton, EmptyState, ErrorState, ConfirmDialog, Pagination, SearchInput
- `@retail/shared/data-access`: ALL API services, AuthStore, UiStore, authInterceptor, errorInterceptor, API_BASE_URL
- `@retail/shared/domain`: All models, enums, DTOs
- `@retail/shared/util`: formatCurrencyCOP, buildHttpParams, documento validator
- `@retail/shared/styles`: SCSS variables, mixins, typography

## UX Screen Mapping (from §11.2)

| Screen | Route | Page Component | Shared | Internal |
|--------|-------|----------------|--------|----------|
| Login | `/login` | LoginPageComponent | — | LoginForm |
| Dashboard | `/dashboard` | DashboardPageComponent | LoadingSkeleton | StatsCard, LowStockAlert, RecentMovements |
| Product List | `/productos` | ProductoListPageComponent | AvailabilityBadge, Pagination, ConfirmDialog | ProductTable |
| Product Form | `/productos/nuevo`, `/:id/editar` | ProductoFormPageComponent | PriceDisplay | ImageUploader |
| Package List | `/paquetes` | PaqueteListPageComponent | Pagination, ConfirmDialog | — |
| Package Form | `/paquetes/nuevo`, `/:id/editar` | PaqueteFormPageComponent | — | ComponentSelector |
| Category List | `/categorias` | CategoriaListPageComponent | ConfirmDialog | — |
| Category Form | `/categorias/nueva`, `/:id/editar` | CategoriaFormPageComponent | — | — |
| Inventory | `/inventario` | InventarioPageComponent | AvailabilityBadge, Pagination | StockTable, AjusteForm |
| Movements | `/inventario/movimientos` | MovimientosPageComponent | Pagination | MovimientoHistory |
| Configuration | `/configuracion` | ConfiguracionPageComponent | ConfirmDialog | ParametroEditor |

## Validation Strategy (from §10)

- Frontend validates FORMAT and COMPLETENESS for immediate feedback
- Business rules are validated by backend
- If frontend validation passes but backend fails, show backend errors in form
- Validation details per form: see CLAUDE_PRODUCTOS.md and CLAUDE_INVENTARIO.md

## Domain Term Mapping (from §11.3)

| Domain Term | UI Term |
|-------------|---------|
| Ítem Inventariable | Producto |
| Paquete | Set / Kit |
| Parámetro Operativo | Configuración |

## Cross-References

- **Root `../../CLAUDE.md`** — workspace conventions, Nx rules
- **Architecture (this app)** — `docs/CLAUDE_ARQUITECTURA.md` for app-specific architecture, features, routing, screen mapping
- **Architecture (shared)** — `docs/arquitectura/` (symlink to workspace `docs/`) for conventions, state, communication, errors, validations
- **Architecture decisions** — `docs/CLAUDE_ARQUITECTURA_DECISIONES.md` for empleado-specific decisions (auth, validation, feature structure)
- **Feature docs** — `src/app/features/CLAUDE_*.md` for feature-specific details
- **Shared libraries** — `../../libs/shared/*/CLAUDE.md` for shared library details
