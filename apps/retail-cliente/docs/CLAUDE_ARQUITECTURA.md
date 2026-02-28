# Arquitectura — retail-cliente

> Documentación de arquitectura específica de la vitrina pública.
>
> **Arquitectura compartida**: Ver [docs compartidos](./arquitectura/) para convenciones, estado, comunicación, errores y validaciones comunes a ambas apps.

---

## Scope de esta App

- **Audiencia**: Clientes (público general) — sin login en MVP
- **Naturaleza**: Vitrina pública de catálogo
- **Auth**: Ninguna en MVP. `core/guards/` preparado para post-MVP
- **Config**: `provideHttpClient(withInterceptors([errorInterceptor]))` — sin `authInterceptor`

---

## Features del Cliente (MVP)

### `features/home`

| Aspecto | Detalle |
|---------|---------|
| **Ruta** | `/` |
| **Descripción** | Página de entrada. Categorías destacadas, productos recientes, buscador. |
| **Componentes internos** | `HomePageComponent`, `FeaturedProductsComponent`, `CategoryHighlightsComponent` |
| **Shared que consume** | `ProductCardComponent`, `SearchInputComponent`, `ProductosApiService`, `CategoriasApiService` |

### `features/catalogo`

| Aspecto | Detalle |
|---------|---------|
| **Rutas** | `/catalogo`, `/catalogo/producto/:id`, `/catalogo/paquete/:id`, `/catalogo/categoria/:id` |
| **Descripción** | Exploración completa del catálogo con filtros, paginación, ordenamiento. |
| **Componentes internos** | `CatalogoPageComponent`, `ProductoDetailPageComponent`, `PaqueteDetailPageComponent`, `CategoriaPageComponent`, `ProductFiltersComponent`, `ProductGridComponent`, `SortSelectorComponent` |
| **Servicios internos** | `CatalogoFilterStore` — estado local de filtros activos |
| **Shared que consume** | `ProductCard`, `PriceDisplay`, `AvailabilityBadge`, `ImageGallery`, `Pagination`, `LoadingSkeleton`, `EmptyState` |

> Walkthrough paso a paso: ver [CLAUDE_ARQUITECTURA_CATALOGO.md](./CLAUDE_ARQUITECTURA_CATALOGO.md)

### `features/info`

| Aspecto | Detalle |
|---------|---------|
| **Ruta** | `/info` |
| **Descripción** | Página estática: información del negocio, ubicación, contacto, políticas. |
| **Componentes internos** | `InfoPageComponent` |

---

## Routing

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

- Todas las rutas son hijas de `ShellComponent` (header + footer)
- Lazy loading con imports **relativos** (nunca paths de librería)
- Preparado para: `/carrito`, `/mis-pedidos` post-MVP

---

## UX Screen Mapping

| Pantalla | Ruta | Page Component | Shared | Internos |
|----------|------|----------------|--------|----------|
| Homepage | `/` | `HomePageComponent` | `ProductCard`, `SearchInput` | `FeaturedProducts`, `CategoryHighlights` |
| Catálogo | `/catalogo` | `CatalogoPageComponent` | `ProductCard`, `AvailabilityBadge`, `Pagination`, `LoadingSkeleton`, `EmptyState` | `ProductFilters`, `ProductGrid`, `SortSelector` |
| Detalle Producto | `/catalogo/producto/:id` | `ProductoDetailPageComponent` | `PriceDisplay`, `AvailabilityBadge`, `ImageGallery`, `LoadingSkeleton` | — |
| Detalle Paquete | `/catalogo/paquete/:id` | `PaqueteDetailPageComponent` | `PriceDisplay`, `AvailabilityBadge`, `ImageGallery` | `ComponentList` |
| Categoría | `/catalogo/categoria/:id` | `CategoriaPageComponent` | (reutiliza catálogo con filtro pre-aplicado) | — |
| Sobre Nosotros | `/info` | `InfoPageComponent` | — | — |

---

## Alertas MVP (cliente)

1. **Sin auth de cliente** — pero `core/guards/` listo para post-MVP (cuentas, historial)
2. **SEO limitado** — SPA sin SSR. Aceptado para MVP. Evaluar Angular SSR post-MVP
3. **Responsive obligatorio** — Mobile-first. Target: viewport 375px
4. **Lazy loading de imágenes** — Usar `LazyImageDirective` de `@retail/shared/ui`
5. **Sin carrito/checkout** — MVP es solo catálogo (browse, filter, view details)

---

## Feature Checklist (Anexo)

Usar para CUALQUIER feature nueva en esta app:

### Pre-implementación
- [ ] Modelos necesarios existen en `@retail/shared/domain`
- [ ] API services necesarios existen en `@retail/shared/data-access`
- [ ] Shared UI components necesarios existen en `@retail/shared/ui`
- [ ] Barrel exports (`index.ts`) de cada lib incluyen lo nuevo

### Estructura
- [ ] Feature directory creado bajo `features/`
- [ ] Page components (containers) en carpetas propias
- [ ] Presentational components en `components/`
- [ ] Local store en `services/` (si aplica)
- [ ] Routes file: `<feature>.routes.ts`

### Implementación
- [ ] Store local usa Angular Signals (no NgRx para state local)
- [ ] Presentational: solo `input()` / `output()`, `OnPush`
- [ ] Container: inyecta servicios, gestiona estado, provee store local
- [ ] Errores → `ErrorState` + signal de error
- [ ] Loading → `LoadingSkeleton` + signal de carga
- [ ] Empty → `EmptyState` cuando no hay datos

### Integración
- [ ] Lazy loading en `app.routes.ts` con import relativo
- [ ] Responsive: mobile-first, probado en viewport 375px
- [ ] Imágenes usan `LazyImageDirective`
- [ ] Precios usan `formatCurrencyCOP`

### Testing
- [ ] Store unit tests (si aplica)
- [ ] Presentational component tests (inputs/outputs)
- [ ] Container component tests (con API services mockeados)
- [ ] Lazy loading verificado (chunk separado en network tab)
