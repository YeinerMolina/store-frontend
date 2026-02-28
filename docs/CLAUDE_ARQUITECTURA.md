# Arquitectura Frontend — Tienda Retail

## Nx Monorepo · Angular 17+ · Dos Aplicaciones

**Stack**: Angular 17+ (Standalone Components, Signals) · Nx Monorepo · Angular Material · SCSS

> Documentación complementaria por scope:
>
> - [Convenciones](./CLAUDE_ARQUITECTURA_CONVENCIONES.md) — Nombrado, estructura de componentes, comandos Nx
> - [Estado](./CLAUDE_ARQUITECTURA_ESTADO.md) — Gestión de estado con Signals
> - [Comunicación](./CLAUDE_ARQUITECTURA_COMUNICACION.md) — HTTP, interceptors, API patterns
> - [Errores](./CLAUDE_ARQUITECTURA_ERRORES.md) — Manejo de errores por capa
> - [Validaciones](./CLAUDE_ARQUITECTURA_VALIDACIONES.md) — Validación frontend/backend

---

## 1. Visión General

### 1.1 Dos Aplicaciones, Un Monorepo

| Aplicación | Audiencia | Naturaleza | Autenticación |
|-----------|-----------|-----------|---------------|
| **retail-cliente** | Clientes (público general) | Vitrina pública, experiencia de compra | Sin auth en MVP, con auth post-MVP |
| **retail-empleado** | Empleados (todos los perfiles) | Backoffice de gestión | JWT obligatorio |

**Justificación de la separación**:

- **Seguridad**: El bundle del cliente nunca contiene código de administración, guards de permisos ni rutas del backoffice.
- **Performance**: El bundle del cliente es más pequeño, optimizado para carga rápida en móvil.
- **Despliegue**: Cada app se despliega a su propio bucket S3 + CloudFront. Un fix en el backoffice no requiere redesplegar la vitrina.
- **UX**: Experiencias completamente distintas. El cliente navega un catálogo visual; el empleado opera formularios y tablas de datos.

### 1.2 Patrón Arquitectónico Frontend

```
┌──────────────────────────────────────────────────────┐
│                   APPLICATIONS                        │
│  retail-cliente              retail-empleado           │
│  ├── features/               ├── features/            │
│  │   ├── home/               │   ├── dashboard/       │
│  │   ├── catalogo/           │   ├── productos/       │
│  │   └── info/               │   ├── inventario/      │
│  ├── core/                   │   └── configuracion/   │
│  └── shell/                  ├── core/                │
│                              └── shell/               │
├──────────────────────────────────────────────────────┤
│              SHARED LIBRARIES (libs/)                  │
│  ui           data-access    domain    util    styles  │
│  (componentes  (servicios    (modelos  (helpers (SCSS  │
│   visuales)     API, stores)  enums)   puros)   vars)  │
└──────────────────────────────────────────────────────┘
```

La regla fundamental: **las dependencias solo fluyen hacia abajo**. Los features viven dentro de cada app (no son libs Nx) porque son código exclusivo de esa aplicación. Solo lo genuinamente compartido entre ambas apps existe como librería en `libs/shared/`.

### 1.3 Stack Técnico

| Tecnología | Uso | Versión |
|-----------|-----|---------|
| **Angular** | Framework principal | 17+ (standalone components, signals, new control flow) |
| **Nx** | Monorepo, build, lint boundaries | Última estable |
| **Angular Material** | Componentes UI base | Alineado con Angular |
| **SCSS** | Estilos | Variables y mixins compartidos |
| **RxJS** | Comunicación HTTP, streams | Incluido con Angular |
| **Angular Signals** | Estado reactivo local y de feature | Nativo Angular 17+ |

---

## 2. Estructura del Monorepo

```
retail-frontend/
├── apps/
│   ├── retail-cliente/          # App vitrina pública
│   │   └── src/app/
│   │       ├── app.config.ts    # provideRouter, provideHttpClient (solo errorInterceptor)
│   │       ├── app.routes.ts    # Rutas raíz con lazy loading
│   │       ├── core/guards/     # (vacío en MVP)
│   │       ├── shell/           # header + footer layout
│   │       └── features/        # home/, catalogo/, info/
│   │
│   └── retail-empleado/         # App backoffice
│       └── src/app/
│           ├── app.config.ts    # provideRouter, provideHttpClient (auth + error interceptor)
│           ├── app.routes.ts    # Rutas con authGuard
│           ├── core/guards/     # auth.guard.ts
│           ├── shell/           # sidebar + header layout
│           └── features/        # login/, dashboard/, productos/, inventario/, configuracion/
│
├── libs/shared/                 # Solo código genuinamente compartido
│   ├── ui/                      # Componentes visuales
│   ├── data-access/             # Servicios API y estado global
│   ├── domain/                  # Modelos, enums, DTOs
│   ├── util/                    # Funciones puras
│   └── styles/                  # SCSS compartido
│
├── docs/                        # Documentación compartida de arquitectura
├── nx.json
├── tsconfig.base.json           # Path aliases (@retail/shared/*)
└── package.json
```

**Decisión arquitectónica**: Features dentro de apps, no como libs Nx. Son código exclusivo de cada app — no hay caso real de reutilización entre apps. Solo lo compartido va a `libs/shared/`.

---

## 3. Librerías Compartidas

### 3.1 `@retail/shared/ui`

Componentes visuales reutilizables entre ambas apps. Presentational only: `input()` / `output()`, sin inyección de servicios API.

| Componente | Uso Cliente | Uso Empleado |
|-----------|-------------|--------------|
| `ProductCardComponent` | Catálogo, Home | Búsqueda de productos |
| `PriceDisplayComponent` | Todo | Todo |
| `AvailabilityBadgeComponent` | Catálogo, Detalle | Inventario |
| `LoadingSkeletonComponent` | Todo | Todo |
| `EmptyStateComponent` | Catálogo vacío | Listas vacías |
| `ErrorStateComponent` | Todo | Todo |
| `ImageGalleryComponent` | Detalle producto | Detalle producto |
| `PaginationComponent` | Catálogo | Listas |
| `SearchInputComponent` | Header cliente | Listas empleado |
| `ConfirmDialogComponent` | (post-MVP) | Acciones destructivas |

**Principios**:
- Todo componente es `standalone: true`
- Todo usa `input()` / `output()` (signal-based)
- Selector con prefijo `retail-`: `retail-product-card`
- Sin inyección de servicios. Sin lógica de negocio.

### 3.2 `@retail/shared/data-access`

Servicios API y estado global compartido.

| Servicio | Endpoints | Usado por |
|---------|-----------|-----------|
| `ProductosApiService` | CRUD `/api/catalogo/productos` | Ambas apps |
| `PaquetesApiService` | CRUD `/api/catalogo/paquetes` | Ambas apps |
| `CategoriasApiService` | CRUD `/api/catalogo/categorias` | Ambas apps |
| `InventarioApiService` | `/api/inventario/stock`, `/movimientos`, `/ajustes` | Ambas apps |
| `AuthApiService` | `/api/auth/login`, `/refresh`, `/logout` | Solo empleado |
| `ConfiguracionApiService` | `/api/configuracion/parametros` | Solo empleado |

**Principios**: Todos `providedIn: 'root'`. Retornan `Observable<T>`. No manejan errores internamente.

### 3.3 `@retail/shared/domain`

Modelos, enums y DTOs — el contrato del frontend con la API.

- Solo interfaces y enums. Sin clases, sin lógica, sin imports de Angular.
- Separar "resumen" de "detalle" cuando un listado retorna menos campos.
- Los DTOs de request representan el body del request HTTP.

### 3.4 `@retail/shared/util`

Funciones puras sin dependencias de Angular: `formatCurrencyCOP`, `buildHttpParams`, `documentoValidator`.

### 3.5 `@retail/shared/styles`

Variables SCSS, mixins, tipografía y tema de Angular Material compartidos.

---

## 4. Features — Estructura Interna

Todos los features siguen la misma estructura dentro de su app:

```
features/{nombre}/
├── {nombre}-page/            # Page component (routable, container/smart)
├── components/               # Presentational components (input/output only)
├── services/                 # Local state — signal-based store (si necesario)
└── {nombre}.routes.ts        # Lazy routes
```

- Page components son **containers**: inyectan servicios, gestionan estado
- Components internos son **presentational**: solo `input()` / `output()`
- El store local es `@Injectable()` sin `providedIn`, provisto en el page component
- Lazy loading via rutas relativas, NO path aliases de librería

---

## 5. Reglas de Dependencia

### Grafo de dependencias

```
apps/* ──► libs/shared/*

libs/shared/ui           ──► libs/shared/domain, libs/shared/util
libs/shared/data-access  ──► libs/shared/domain, libs/shared/util
libs/shared/domain       ──► (nada)
libs/shared/util         ──► (nada)
libs/shared/styles       ──► (nada)
```

### Dependencias prohibidas

| Desde | Hacia | Razón |
|-------|-------|-------|
| `retail-cliente` | `retail-empleado` | Apps aisladas. Compartir vía `libs/shared/`. |
| `retail-empleado` | `retail-cliente` | Idem. |
| `shared/ui` | `shared/data-access` | UI no conoce de dónde vienen los datos. |
| `shared/domain` | Cualquier lib | Domain es la base. Sin dependencias. |
| Feature A | Feature B (misma app) | Features independientes. Comunicación vía shared. |

### Tags Nx

```json
{ "scope:cliente", "type:app" }       // retail-cliente
{ "scope:empleado", "type:app" }      // retail-empleado
{ "scope:shared", "type:ui" }         // shared/ui
{ "scope:shared", "type:data-access" } // shared/data-access
{ "scope:shared", "type:domain" }     // shared/domain
```

---

## 6. Guía de Decisiones Rápida

### ¿Dónde pongo este componente?

```
¿Lo usan ambas apps?          → libs/shared/ui/
¿Lo usan 2+ features?         → Evaluar si ambas apps lo usarían → shared/ui o shared local
¿Solo 1 feature?              → components/ dentro del feature
```

### ¿Dónde pongo este servicio?

```
¿Comunica con la API?          → libs/shared/data-access/services/api/
¿Estado global (auth, UI)?     → libs/shared/data-access/services/state/
¿Estado local de feature?      → services/ dentro del feature (NO providedIn root)
¿Específico de la app?         → core/ de la app
```

### ¿Signal, Observable o ambos?

| Situación | Usar |
|-----------|------|
| Estado local de componente | `signal()` |
| Estado de formulario | Reactive Forms |
| Respuesta HTTP | `Observable` → `.subscribe()` → `signal.set()` |
| Estado compartido en feature | Servicio con `signal()` |
| Streams complejos (debounce, combineLatest) | `Observable` con RxJS |

---

## 7. Riesgos y Alertas

| Riesgo | Mitigación |
|--------|-----------|
| shared/ui crece sin control | Solo va a shared si lo usan ambas apps HOY |
| Feature monolítico | Dividir si supera ~10 componentes o 3 páginas |
| Modelos divergen del backend | Mantener domain alineado. Post-MVP: generar tipos desde OpenAPI |
| Bundle del cliente se infla | Importar Material por componente. Todo feature lazy-loaded |
| SEO del catálogo público | Aceptado en MVP. Post-MVP evaluar Angular SSR |
| Responsive desde día 1 | Mobile-first obligatorio. Target: viewport 375px |

### Decisiones costosas de revertir

| Decisión | Costo de cambio |
|----------|----------------|
| Angular Material como UI library | Medio |
| Nx monorepo con 2 apps | Alto |
| Signals para estado (sin NgRx) | Bajo — migración incremental |
| Estructura de rutas | Medio — deep links, bookmarks |
