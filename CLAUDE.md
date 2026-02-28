<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

---

# Retail Frontend — Workspace Reference

Retail storefront and backoffice frontend. Two Angular apps in one Nx monorepo for a Colombian retail business selling accessories and beauty products. The public storefront (`retail-cliente`) targets women 15-50, mobile-first. The backoffice (`retail-empleado`) manages products, inventory, and configuration.

**Source of truth**: `arquitectura_frontend.md` (root of outer repo). This file summarizes workspace-transversal decisions. Per-project details live in their own CLAUDE.md files (see [Cross-References](#11-cross-references)).

---

## 1. Vision

### Two Apps, One Monorepo

| App | Audience | Nature | Auth |
|-----|----------|--------|------|
| `retail-cliente` | Public customers | Storefront, catalog browsing | None in MVP (prepared for post-MVP) |
| `retail-empleado` | Employees (all roles) | Backoffice management | JWT required |

### Why Two Separate Apps

- **Security**: Client bundle never contains admin code, permission guards, or backoffice routes
- **Performance**: Smaller client bundle, optimized for mobile fast-load
- **Deployment**: Each app deploys to its own S3 + CloudFront. A backoffice fix doesn't redeploy the storefront
- **UX**: Completely different paradigms — visual catalog browsing vs. data tables and forms

### Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| Angular | Framework | 21 (standalone components, signals, new control flow) |
| Nx | Monorepo, build, lint boundaries | Latest stable |
| Angular Material | Base UI components | Aligned with Angular |
| SCSS | Styles | Shared variables and mixins |
| RxJS | HTTP communication, streams | Included with Angular |
| Angular Signals | Reactive local and feature state | Native Angular 21 |
| Zod | Complex form validation | Optional |

### Architecture Pattern

Dependencies flow DOWN only. Features live inside apps (not as Nx libs). Only genuinely shared code lives in `libs/shared/`.

```
APPLICATIONS
  retail-cliente         retail-empleado
  +-- features/          +-- features/
  +-- core/              +-- core/
  +-- shell/             +-- shell/

SHARED LIBRARIES (libs/)
  ui          data-access    domain    util    styles
  (visual     (API services  (models   (pure   (SCSS
  components)  and stores)    enums)   funcs)   vars)
```

---

## 2. Workspace Structure

```
retail-frontend/
+-- apps/
|   +-- retail-cliente/          # Public storefront (port 4200)
|   |   +-- src/app/
|   |       +-- core/            # App-specific singletons, guards
|   |       +-- shell/           # Layout: header, footer
|   |       +-- features/        # home, catalogo, info
|   +-- retail-empleado/         # Backoffice (port 4201)
|       +-- src/app/
|           +-- core/            # App-specific singletons, guards
|           +-- shell/           # Layout: sidebar, header
|           +-- features/        # login, dashboard, productos, inventario, configuracion
+-- libs/
|   +-- shared/
|       +-- ui/                  # Presentational components (ProductCard, etc.)
|       +-- data-access/         # API services, stores, interceptors
|       +-- domain/              # Interfaces, enums, DTOs
|       +-- util/                # Pure functions, formatters, helpers
|       +-- styles/              # SCSS variables, mixins, theme
+-- tools/
+-- nx.json
+-- tsconfig.base.json           # Path aliases: @retail/shared/*
+-- package.json
```

**Key decision**: Features are directories inside each app, NOT Nx libs. They have no `project.json`, no barrel exports, no tags. Lazy loading uses relative imports. Only genuinely shared code between both apps exists as Nx libs in `libs/shared/`.

> For internal structure details, see:
> - `apps/retail-cliente/CLAUDE.md`
> - `apps/retail-empleado/CLAUDE.md`
> - `libs/shared/ui/CLAUDE.md`
> - `libs/shared/data-access/CLAUDE.md`
> - `libs/shared/domain/CLAUDE.md`
> - `libs/shared/util/CLAUDE.md`
> - `libs/shared/styles/CLAUDE.md`

---

## 3. Dependency Rules

### Dependency Graph

```
apps/retail-cliente  -----> libs/shared/*
apps/retail-empleado -----> libs/shared/*

libs/shared/ui          --> libs/shared/domain, libs/shared/util
libs/shared/data-access --> libs/shared/domain, libs/shared/util
libs/shared/domain      --> (nothing)
libs/shared/util        --> (nothing)
libs/shared/styles      --> (nothing)
```

### Prohibited Dependencies

| From | To | Why |
|------|----|-----|
| `retail-cliente` | `retail-empleado` | Apps are isolated worlds. Share code via `libs/shared/` |
| `retail-empleado` | `retail-cliente` | Same |
| `shared/ui` | `shared/data-access` | UI doesn't know where data comes from. Receives everything via input |
| `shared/domain` | Any other lib | Domain is the base. Zero dependencies |
| `shared/util` | Any other lib | Util is the base. Zero dependencies |
| Feature A | Feature B (same app) | Features are independent. Communicate via shared or app core services |

### Nx Tags

| Project | Tags |
|---------|------|
| `retail-cliente` | `scope:cliente`, `type:app` |
| `retail-empleado` | `scope:empleado`, `type:app` |
| `shared/ui` | `scope:shared`, `type:ui` |
| `shared/data-access` | `scope:shared`, `type:data-access` |
| `shared/domain` | `scope:shared`, `type:domain` |
| `shared/util` | `scope:shared`, `type:util` |

### ESLint enforce-module-boundaries

```json
{
  "@nx/enforce-module-boundaries": [
    "error",
    {
      "depConstraints": [
        { "sourceTag": "scope:cliente", "onlyDependOnLibsWithTags": ["scope:shared"] },
        { "sourceTag": "scope:empleado", "onlyDependOnLibsWithTags": ["scope:shared"] },
        { "sourceTag": "scope:shared", "onlyDependOnLibsWithTags": ["scope:shared"] },
        { "sourceTag": "type:ui", "onlyDependOnLibsWithTags": ["type:domain", "type:util"] },
        { "sourceTag": "type:data-access", "onlyDependOnLibsWithTags": ["type:domain", "type:util"] }
      ]
    }
  ]
}
```

Feature-to-feature isolation is enforced by convention (no Nx tags on features since they're not Nx projects). If a feature needs something from another feature, that code should move to `shared/` or a `core/` service.

---

## 4. Conventions

### File Naming (kebab-case, no exceptions)

| Type | Pattern | Example |
|------|---------|---------|
| Page component | `{name}-page.component.ts` | `catalogo-page.component.ts` |
| UI component | `{name}.component.ts` | `product-card.component.ts` |
| API service | `{name}-api.service.ts` | `productos-api.service.ts` |
| Store | `{name}.store.ts` | `auth.store.ts` |
| Interceptor | `{name}.interceptor.ts` | `auth.interceptor.ts` |
| Guard | `{name}.guard.ts` | `auth.guard.ts` |
| Pipe | `{name}.pipe.ts` | `currency-cop.pipe.ts` |
| Directive | `{name}.directive.ts` | `lazy-image.directive.ts` |
| Model | `{name}.model.ts` | `producto.model.ts` |
| Enum | `{name}.enum.ts` | `estado-producto.enum.ts` |
| DTO | `{name}.dto.ts` | `crear-producto.dto.ts` |
| Routes | `{feature}.routes.ts` | `catalogo.routes.ts` |
| Formatter | `{name}.formatter.ts` | `currency.formatter.ts` |
| Helper | `{name}.helper.ts` | `http-params.helper.ts` |
| Test | `{name}.component.spec.ts` | `product-card.component.spec.ts` |

### Class Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Component | PascalCase + `Component` | `ProductCardComponent` |
| Service | PascalCase + `Service` | `ProductosApiService` |
| Guard | camelCase (functional) | `authGuard` |
| Pipe | PascalCase + `Pipe` | `CurrencyCopPipe` |
| Directive | PascalCase + `Directive` | `LazyImageDirective` |
| Model | PascalCase | `ProductoResumen` |
| Enum | PascalCase, values UPPER_SNAKE | `EstadoProducto.ACTIVO` |
| Store | PascalCase + `Store` | `CatalogoFilterStore` |
| CSS selector | `retail-{name}` | `retail-product-card` |

### Component Structure (order within file)

1. Imports
2. `@Component` decorator
3. Class body:
   - a. Inputs (signal-based)
   - b. Outputs (signal-based)
   - c. Injected services (`inject()`)
   - d. Computed signals / local state
   - e. Lifecycle hooks
   - f. Public methods (used by template)
   - g. Private methods

### Component Rules

- `standalone: true` — always
- `ChangeDetectionStrategy.OnPush` — always
- `input()` / `output()` signal-based — never `@Input()` / `@Output()`
- Separate template and style files (not inline, unless <10 lines of template)
- One component per file
- CSS selector prefix: `retail-`
- Comment WHY, never WHAT

---

## 5. State Management

### Where State Lives

| State Type | Location | Mechanism | Example |
|-----------|----------|-----------|---------|
| UI component state | In the component | `signal()` | Sidebar toggle, form field |
| Feature state | Feature's `services/` dir | Service with signals | Active catalog filters, current page |
| Global app state | `shared/data-access/state/` | Singleton service with signals | Auth token, logged-in user |
| Server data | Not stored globally (MVP) | Fetch on demand via API services | Product list, product detail |

### Signal Store Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class AuthStore {
  // Private writable signals
  private _token = signal<string | null>(null);
  private _empleado = signal<EmpleadoResumen | null>(null);

  // Public readonly signals
  readonly token = this._token.asReadonly();
  readonly empleado = this._empleado.asReadonly();

  // Computed
  readonly isAuthenticated = computed(() => this._token() !== null);

  // Actions
  setAuth(token: string, empleado: EmpleadoResumen): void { ... }
  clearAuth(): void { ... }
}
```

Feature-local stores use `@Injectable()` (NOT `providedIn: 'root'`) and are provided at the route level.

### What NOT To Do

- **No global server data cache in MVP** — each component fetches what it needs. Reconsider post-MVP if performance demands it
- **No NgRx/NGXS in MVP** — Angular signals suffice for 1-2 devs with 6-7 screens per app
- **No JWT in localStorage** — use HttpOnly cookies. `AuthStore` tracks auth state for UI purposes, not the raw token

---

## 6. Error Handling

### Strategy by Layer

| Layer | Responsibility | Action |
|-------|---------------|--------|
| **Interceptor** | Cross-cutting HTTP errors | 401 -> redirect to login. All others -> propagate to caller |
| **API Service** | Nothing (by default) | Let errors flow to component. Exception: 404 -> `null` when semantically meaningful |
| **Component** | Show user feedback | Use `ErrorStateComponent` for load errors, inline messages for form errors |

### Component Pattern

```typescript
productos = signal<ProductoResumen[]>([]);
loading = signal(false);
error = signal<string | null>(null);
```

```html
@if (loading()) {
  <retail-loading-skeleton />
} @else if (error()) {
  <retail-error-state [mensaje]="error()!" (reintentar)="cargarProductos()" />
} @else if (productos().length === 0) {
  <retail-empty-state mensaje="No encontramos productos con estos filtros" />
} @else {
  <retail-product-grid [productos]="productos()" />
}
```

### User-Facing Error Messages

| HTTP Error | User Message | Action |
|-----------|-------------|--------|
| 400 (validation) | Show field errors from backend | Highlight in form |
| 401 | (interceptor redirects to login) | -- |
| 403 | "No tienes permiso para realizar esta accion" | -- |
| 404 | "Este producto ya no esta disponible" | Link to catalog |
| 409 (conflict) | Backend-specific message | -- |
| 500 | "Ocurrio un error inesperado. Intenta de nuevo." | Retry button |
| Network error | "No pudimos conectarnos. Verifica tu conexion." | Retry button |

**Never show**: status codes, technical messages, stacktraces.

---

## 7. Developer Decision Guide

### Where Does This Component Go?

```
Both apps use it?
  -> YES -> libs/shared/ui/

2+ features in the SAME app use it?
  -> YES -> Would the OTHER app also use it?
    -> YES -> libs/shared/ui/
    -> NO  -> Evaluate a local shared/ directory inside the app
  -> NO (only 1 feature) -> components/ inside the feature
```

### Where Does This Service Go?

```
Communicates with backend API?
  -> YES -> libs/shared/data-access/services/api/

Global state (auth, UI)?
  -> YES -> libs/shared/data-access/services/state/

Local state for a feature?
  -> YES -> services/ inside the feature (NOT providedIn root)

App-specific service (e.g., empleado sidebar state)?
  -> YES -> core/ of the corresponding app
```

### Where Does This Model/Interface Go?

```
API contract (request/response)?
  -> YES -> libs/shared/domain/ (models/ or dtos/)

Enum used in UI?
  -> YES -> libs/shared/domain/enums/

Internal interface for a single feature?
  -> YES -> Inline in the component or a local types file in the feature
```

### Signal vs Observable

| Situation | Use |
|-----------|-----|
| Component-local state (toggle, counter) | `signal()` |
| Form state | Reactive Forms (`FormGroup`) |
| HTTP response | `Observable` -> `.subscribe()` -> `signal.set()` |
| Shared state between components of a feature | Service with `signal()` |
| Complex streams (debounce, combineLatest) | `Observable` with RxJS operators |

---

## 8. Nx Commands Reference

```bash
# Development
npx nx serve retail-cliente                          # Storefront on localhost:4200
npx nx serve retail-empleado                         # Backoffice on localhost:4201
npx nx run-many -t serve -p retail-cliente,retail-empleado  # Both in parallel

# Generation (shared libs only — features are manual)
npx nx g @nx/angular:component product-card --project=shared-ui --standalone
npx nx g @nx/angular:service productos-api --project=shared-data-access

# Features: create manually inside apps following the feature structure pattern.
# Do NOT use Nx generators for features.

# Validation
npx nx lint retail-cliente                           # Lint (includes boundary check)
npx nx test retail-cliente                           # Unit tests
npx nx lint shared-ui                                # Lint a shared lib
npx nx affected -t lint                              # Lint only affected
npx nx affected -t test                              # Test only affected

# Build
npx nx build retail-cliente --configuration=production
npx nx build retail-empleado --configuration=production

# Analysis
npx nx graph                                         # Visual dependency graph
npx nx show project retail-cliente                   # Project details
```

---

## 9. Risks and Alerts

### Structural Risks

| Risk | Description | Mitigation |
|------|------------|------------|
| shared/ui grows unchecked | Components added "just in case" that only one app uses | Strict rule: only goes to shared/ui if BOTH apps use it TODAY. Review in PR |
| Monolithic feature | `features/productos` has CRUD for products + packages + categories, becomes unmanageable | If a feature exceeds ~10 components or 3 pages with very different logic, split it. Since features are plain directories, splitting is cheap |
| Frontend models diverge from backend | Backend changes a field, frontend breaks at runtime | Keep shared/domain aligned with backend DTOs. Post-MVP: evaluate auto-generation from OpenAPI/Swagger |
| Client bundle bloat | Unnecessary Angular Material imports, non-lazy imports | Import Material components individually (not full modules). All features are lazy-loaded. Verify bundle size in CI |

### Costly-to-Reverse Decisions

| Decision | Cost to Change | When to Reconsider |
|----------|---------------|-------------------|
| Angular Material as UI library | Medium (rewrite visual components) | If visual design diverges significantly from Material Design |
| Nx monorepo with 2 apps | High (separate repos) | Only if release cycles diverge radically |
| Signals for state (no NgRx) | Low (migration is incremental) | If state complexity grows significantly post-MVP |
| Route structure | Medium (deep links, bookmarks break) | Define URLs before launch |
| Selector prefix `retail-` | Low (find & replace) | Don't reconsider |

### MVP-Specific Alerts

| Alert | Action |
|-------|--------|
| Client app has no auth but must be prepared | Leave `core/guards/` empty but existing. Design routes anticipating `/carrito`, `/mis-pedidos` post-MVP |
| Product images need lazy loading | Implement `LazyImageDirective` in shared/ui from MVP. Use Intersection Observer |
| SEO limitation (SPA without SSR) | Accept for MVP. Post-MVP evaluate Angular SSR for catalog routes |
| Responsive mobile-first from day 1 | Target audience accesses primarily from mobile. All components must be mobile-first. Breakpoints in shared/styles |

---

## 10. Feature Implementation Checklist

When implementing a new feature, follow this checklist in order:

```
[ ] Verify required models exist in @retail/shared/domain
[ ] Verify required API services exist in @retail/shared/data-access
[ ] Verify required shared UI components exist
    [ ] If missing -> create them first (only if both apps use them)

[ ] Create feature directory inside apps/{app}/src/app/features/
[ ] Create local store if the feature needs shared state between its components
[ ] Create internal components in components/
[ ] Create page components (routable)
[ ] Define lazy routes in {feature}.routes.ts
[ ] Register lazy route in app.routes.ts with relative import

[ ] Verify ChangeDetectionStrategy.OnPush on ALL components
[ ] Verify standalone: true on ALL components
[ ] Verify NO imports from the other app or other features
[ ] Verify loading/error/empty/data state handling in all pages

[ ] Unit tests for components with logic
[ ] Unit tests for local store (if exists)

[ ] PR with clear description
[ ] CI green (nx lint + nx test affected)
```

---

## 11. Cross-References

Detailed per-project documentation lives in each project's own CLAUDE.md:

| File | Contents |
|------|----------|
| `apps/retail-cliente/CLAUDE.md` | Client app: routes, features (home, catalogo, info), shell layout, core services |
| `apps/retail-empleado/CLAUDE.md` | Employee app: routes, features (login, dashboard, productos, inventario, configuracion), auth guard, shell layout |
| `libs/shared/ui/CLAUDE.md` | Shared UI components catalog, usage guidelines, presentational patterns |
| `libs/shared/data-access/CLAUDE.md` | API services, stores, interceptors, injection tokens |
| `libs/shared/domain/CLAUDE.md` | Models, enums, DTOs — the API contract |
| `libs/shared/util/CLAUDE.md` | Pure functions, formatters, helpers |
| `libs/shared/styles/CLAUDE.md` | SCSS variables, mixins, typography, Angular Material theme |

**Architecture spec**: `../arquitectura_frontend.md` (full source of truth with code examples and detailed rationale)
