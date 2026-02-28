# Arquitectura — retail-empleado

> Documentación de arquitectura específica del backoffice.
>
> **Arquitectura compartida**: Ver [docs compartidos](./arquitectura/) para convenciones, estado, comunicación, errores y validaciones comunes a ambas apps.

---

## Scope de esta App

- **Audiencia**: Empleados (todos los perfiles)
- **Naturaleza**: Backoffice de gestión (CRUD, inventario, configuración)
- **Auth**: JWT obligatorio para todas las rutas excepto `/login`
- **Config**: `provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))` — AMBOS interceptors

---

## Features del Empleado (MVP)

### `features/login`

| Aspecto | Detalle |
|---------|---------|
| **Ruta** | `/login` |
| **Descripción** | Formulario de autenticación. Única pantalla sin JWT. |
| **Componentes** | `LoginPageComponent`, `LoginFormComponent` |
| **Shared** | `AuthApiService`, `AuthStore` |

### `features/dashboard`

| Aspecto | Detalle |
|---------|---------|
| **Ruta** | `/dashboard` |
| **Descripción** | Vista inicial post-login. Total productos activos, stock bajo, últimos movimientos. |
| **Componentes** | `DashboardPageComponent`, `StatsCardComponent`, `LowStockAlertComponent`, `RecentMovementsComponent` |
| **Shared** | `LoadingSkeleton`, `ErrorState`, `ProductosApiService`, `InventarioApiService` |

### `features/productos`

| Aspecto | Detalle |
|---------|---------|
| **Rutas** | `/productos`, `/productos/nuevo`, `/productos/:id/editar`, `/paquetes`, `/paquetes/nuevo`, `/paquetes/:id/editar`, `/categorias`, `/categorias/nueva`, `/categorias/:id/editar` |
| **Descripción** | CRUD completo de productos, paquetes y categorías. |
| **Componentes** | `ProductoListPage`, `ProductoFormPage`, `PaqueteListPage`, `PaqueteFormPage`, `CategoriaListPage`, `CategoriaFormPage`, `ProductTable`, `ImageUploader`, `ComponentSelector` |
| **Shared** | `PriceDisplay`, `AvailabilityBadge`, `ConfirmDialog`, `Pagination` |

### `features/inventario`

| Aspecto | Detalle |
|---------|---------|
| **Rutas** | `/inventario`, `/inventario/movimientos` |
| **Descripción** | Vista de stock, registro de entradas/ajustes, historial de movimientos. |
| **Componentes** | `InventarioPage`, `MovimientosPage`, `StockTable`, `AjusteForm`, `MovimientoHistory` |
| **Shared** | `AvailabilityBadge`, `Pagination`, `ConfirmDialog` |

### `features/configuracion`

| Aspecto | Detalle |
|---------|---------|
| **Ruta** | `/configuracion` |
| **Descripción** | Listado de parámetros operativos con edición inline. Solo perfil ADMIN. |
| **Componentes** | `ConfiguracionPage`, `ParametroEditor` |
| **Shared** | `ConfirmDialog`, `ConfiguracionApiService` |

---

## Routing

```typescript
Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.routes').then(m => m.loginRoutes),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes')... },
      { path: 'productos', loadChildren: () => import('./features/productos/productos.routes')... },
      { path: 'inventario', loadChildren: () => import('./features/inventario/inventario.routes')... },
      { path: 'configuracion', loadChildren: () => import('./features/configuracion/configuracion.routes')... },
    ],
  },
];
```

- Login route FUERA del shell (sin sidebar/header)
- Todas las demás rutas protegidas por `authGuard`
- Lazy loading con imports relativos

---

## UX Screen Mapping

| Pantalla | Ruta | Page Component | Shared | Internos |
|----------|------|----------------|--------|----------|
| Login | `/login` | `LoginPageComponent` | — | `LoginForm` |
| Dashboard | `/dashboard` | `DashboardPageComponent` | `LoadingSkeleton` | `StatsCard`, `LowStockAlert`, `RecentMovements` |
| Productos | `/productos` | `ProductoListPageComponent` | `AvailabilityBadge`, `Pagination`, `ConfirmDialog` | `ProductTable` |
| Form Producto | `/productos/nuevo`, `/:id/editar` | `ProductoFormPageComponent` | `PriceDisplay` | `ImageUploader` |
| Paquetes | `/paquetes` | `PaqueteListPageComponent` | `Pagination`, `ConfirmDialog` | — |
| Form Paquete | `/paquetes/nuevo`, `/:id/editar` | `PaqueteFormPageComponent` | — | `ComponentSelector` |
| Categorías | `/categorias` | `CategoriaListPageComponent` | `ConfirmDialog` | — |
| Form Categoría | `/categorias/nueva`, `/:id/editar` | `CategoriaFormPageComponent` | — | — |
| Inventario | `/inventario` | `InventarioPageComponent` | `AvailabilityBadge`, `Pagination` | `StockTable`, `AjusteForm` |
| Movimientos | `/inventario/movimientos` | `MovimientosPageComponent` | `Pagination` | `MovimientoHistory` |
| Configuración | `/configuracion` | `ConfiguracionPageComponent` | `ConfirmDialog` | `ParametroEditor` |

---

## Domain Term Mapping

| Término del dominio | Término en la UI |
|-------------------|-----------------|
| Ítem Inventariable | Producto |
| Paquete | Set / Kit |
| Parámetro Operativo | Configuración |

---

## Decisiones Específicas

> Ver [CLAUDE_ARQUITECTURA_DECISIONES.md](./CLAUDE_ARQUITECTURA_DECISIONES.md) para decisiones arquitectónicas exclusivas de esta app.

---

## Feature Checklist

Usar para CUALQUIER feature nueva en esta app:

- [ ] Crear directorio bajo `src/app/features/{name}/`
- [ ] Crear `{name}.routes.ts` con rutas lazy
- [ ] Crear `{name}-page/` con el page component (entry point routable)
- [ ] Registrar rutas en `app.routes.ts` (children del shell)
- [ ] Crear `components/` para componentes internos
- [ ] Crear `services/` solo si necesita estado local
- [ ] Importar shared dependencies desde `@retail/shared/*`
- [ ] Agregar ruta a la sidebar del shell
- [ ] Proteger con `authGuard` (salvo login)
- [ ] Crear `CLAUDE_{NAME}.md` para documentar el feature
- [ ] Verificar lazy loading (network tab — chunk separado)
- [ ] Error handling con `ErrorState` para fallos de API
- [ ] Loading states con `LoadingSkeleton`
