# Convenciones del Proyecto

> Parte de la [Arquitectura Frontend](./CLAUDE_ARQUITECTURA.md)

---

## 1. Nombrado de Archivos

Todo en **kebab-case**. Sin excepciones.

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Componente (página) | `{nombre}-page.component.ts` | `catalogo-page.component.ts` |
| Componente (UI) | `{nombre}.component.ts` | `product-card.component.ts` |
| Servicio API | `{nombre}-api.service.ts` | `productos-api.service.ts` |
| Store (estado) | `{nombre}.store.ts` | `auth.store.ts` |
| Interceptor | `{nombre}.interceptor.ts` | `auth.interceptor.ts` |
| Guard | `{nombre}.guard.ts` | `auth.guard.ts` |
| Pipe | `{nombre}.pipe.ts` | `currency-cop.pipe.ts` |
| Directiva | `{nombre}.directive.ts` | `lazy-image.directive.ts` |
| Modelo | `{nombre}.model.ts` | `producto.model.ts` |
| Enum | `{nombre}.enum.ts` | `estado-producto.enum.ts` |
| DTO | `{nombre}.dto.ts` | `crear-producto.dto.ts` |
| Rutas de feature | `{feature}.routes.ts` | `catalogo.routes.ts` |
| Formatter | `{nombre}.formatter.ts` | `currency.formatter.ts` |
| Helper | `{nombre}.helper.ts` | `http-params.helper.ts` |
| Test | `{nombre}.component.spec.ts` | `product-card.component.spec.ts` |

---

## 2. Nombrado de Clases y Elementos

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componente | PascalCase + `Component` | `ProductCardComponent` |
| Servicio | PascalCase + `Service` | `ProductosApiService` |
| Guard | camelCase (functional guard) | `authGuard` |
| Pipe | PascalCase + `Pipe` | `CurrencyCopPipe` |
| Directiva | PascalCase + `Directive` | `LazyImageDirective` |
| Modelo (interface) | PascalCase | `ProductoResumen` |
| Enum | PascalCase (tipo), UPPER_SNAKE (valores) | `EstadoProducto.ACTIVO` |
| Store | PascalCase + `Store` | `CatalogoFilterStore` |
| Selector CSS | `retail-{nombre}` | `retail-product-card` |

---

## 3. Estructura de un Componente

```typescript
// Orden dentro del archivo:
// 1. Imports
// 2. @Component decorator
// 3. Clase:
//    a. Inputs (signals)
//    b. Outputs (signals)
//    c. Injected services
//    d. Computed signals / estado local
//    e. Lifecycle hooks
//    f. Métodos públicos (template)
//    g. Métodos privados

@Component({
  selector: 'retail-product-card',
  standalone: true,
  imports: [PriceDisplayComponent, AvailabilityBadgeComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  producto = input.required<ProductoResumen>();
  disponibilidad = input.required<Disponibilidad>();

  cardClick = output<string>();

  precioFormateado = computed(() => formatCurrencyCOP(this.producto().precio));

  onCardClick(): void {
    this.cardClick.emit(this.producto().id);
  }
}
```

**Reglas**:
- Todo componente es `standalone: true`
- Todo componente usa `ChangeDetectionStrategy.OnPush`
- Usar `input()` / `output()` (signal-based), no `@Input()` / `@Output()`
- Template y estilos en archivos separados (no inline) salvo componentes triviales (<10 líneas)
- Un componente por archivo

---

## 4. Documentación en Código

**Comentar el POR QUÉ, nunca el QUÉ.**

```typescript
// CORRECTO — explica por qué
/** catchError 404 → null porque la API retorna 404 cuando no hay carrito activo, no es un error real */
obtenerCarritoActivo(): Observable<Carrito | null> {
  return this.http.get<Carrito>(`${this.baseUrl}/carritos/activo`).pipe(
    catchError(err => err.status === 404 ? of(null) : throwError(() => err))
  );
}

// INCORRECTO — describe lo que el código ya dice
/** Gets the active cart from the API */
obtenerCarritoActivo(): Observable<Carrito | null> { ... }
```

---

## 5. Comandos Nx de Referencia

```bash
# --- Desarrollo ---
nx serve retail-cliente                          # localhost:4200
nx serve retail-empleado                         # localhost:4201
nx run-many -t serve -p retail-cliente,retail-empleado  # Ambas en paralelo

# --- Generación (solo para libs compartidas) ---
nx g @nx/angular:library shared/ui --directory=libs/shared/ui --standalone --tags="scope:shared,type:ui"
nx g @nx/angular:component product-card --project=shared-ui --standalone
nx g @nx/angular:service productos-api --project=shared-data-access

# --- Features (crear manualmente dentro de la app) ---
# No se generan con Nx. Crear directorios siguiendo la estructura de §4.
# mkdir -p apps/retail-cliente/src/app/features/catalogo/{catalogo-page,components,services}

# --- Validación ---
nx lint retail-cliente                           # Lint (incluye boundary check)
nx test retail-cliente                           # Tests
nx affected -t lint                              # Lint solo lo afectado
nx affected -t test                              # Test solo lo afectado
nx affected -t build                             # Build solo lo afectado

# --- Build ---
nx build retail-cliente --configuration=production
nx build retail-empleado --configuration=production

# --- Análisis ---
nx graph                                         # Grafo de dependencias
nx show project retail-cliente                   # Detalles del proyecto
```
