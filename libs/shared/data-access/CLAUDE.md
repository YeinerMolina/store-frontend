# @retail/shared/data-access — API Services and Global State

**Purpose**: Services for REST API communication and global shared state between both apps.

**Tags**: `scope:shared`, `type:data-access`

**Allowed Dependencies**: `@retail/shared/domain`, `@retail/shared/util`. NEVER depend on `@retail/shared/ui`.

**Import Path**: `@retail/shared/data-access`

## Structure

```
src/lib/
├── services/
│   ├── api/
│   │   ├── productos-api.service.ts
│   │   ├── categorias-api.service.ts
│   │   ├── paquetes-api.service.ts
│   │   ├── inventario-api.service.ts
│   │   ├── auth-api.service.ts
│   │   └── configuracion-api.service.ts
│   └── state/
│       ├── auth.store.ts        # Global auth state (token presence, user info)
│       └── ui.store.ts          # Global UI state (sidebar, theme)
├── interceptors/
│   ├── auth.interceptor.ts      # Adds JWT Bearer to requests (empleado only)
│   └── error.interceptor.ts     # 401 → redirect to login, others propagate
├── tokens/
│   └── api-config.token.ts      # InjectionToken for API_BASE_URL
└── index.ts
```

## API Service Principles

- All `providedIn: 'root'` (singleton, tree-shakeable)
- Use `inject(HttpClient)` and `inject(API_BASE_URL)`
- Return `Observable<T>` with types from `@retail/shared/domain`
- Do NOT handle errors internally — errors flow to the interceptor
- Public and protected endpoints coexist in the same service; the interceptor handles JWT injection

## API Services

| Service | Endpoints | Used by |
|---------|-----------|---------|
| ProductosApiService | GET/POST/PATCH/DELETE `/api/catalogo/productos` | Cliente: catalog. Empleado: product management |
| PaquetesApiService | GET/POST/PATCH `/api/catalogo/paquetes` | Cliente: package detail. Empleado: package management |
| CategoriasApiService | GET/POST/PATCH `/api/catalogo/categorias` | Cliente: filters/nav. Empleado: category management |
| InventarioApiService | GET `/api/inventario/stock`, POST movimientos/ajustes | Cliente: availability. Empleado: stock management |
| AuthApiService | POST login/refresh/logout | Empleado: authentication |
| ConfiguracionApiService | GET/PATCH `/api/configuracion/parametros` | Empleado: config |

## Interceptors

- **`authInterceptor`**: functional interceptor, injects Bearer token from AuthStore. Used ONLY by retail-empleado.
- **`errorInterceptor`**: functional interceptor, catches 401 → clears auth + redirects to `/login`. Used by BOTH apps.

## Stores (Signal-based pattern)

- Private writable signals (`_token`, `_empleado`)
- Public readonly signals (`token`, `empleado`)
- Computed signals (`isAuthenticated`, `nombreEmpleado`)
- Action methods (`setAuth`, `clearAuth`)

## Backend Communication Config

- **retail-cliente**: `provideHttpClient(withInterceptors([errorInterceptor]))` — no auth interceptor
- **retail-empleado**: `provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))` — both

## Cross-References

- `../../../CLAUDE.md` — workspace state management, error handling
- `../domain/CLAUDE.md` — types used by services
