# Implementación del Catálogo — Walkthrough Paso a Paso

> Feature más complejo de `retail-cliente`. Sirve como ejemplo de referencia para implementar cualquier feature.

---

## Paso 1: Verificar Modelos en `shared/domain`

Verificar en `libs/shared/domain/src/lib/`:

### Modelos requeridos

```typescript
interface ProductoResumen {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  disponibilidad: DisponibilidadProducto;
  tipo: TipoProducto;
  categoriaId: string;
}

interface ProductoDetalle extends ProductoResumen {
  imagenes: string[];
  especificaciones: Record<string, string>;
  categoriaNombre: string;
}

interface PaqueteDetalle {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioIndividual: number;
  ahorro: number;
  imagenUrl: string;
  imagenes: string[];
  disponibilidad: DisponibilidadProducto;
  componentes: ComponentePaquete[];
}
```

### Enums requeridos

```typescript
enum DisponibilidadProducto {
  DISPONIBLE = 'DISPONIBLE',
  AGOTADO = 'AGOTADO',
  BAJO_STOCK = 'BAJO_STOCK',
}

enum TipoProducto {
  SIMPLE = 'SIMPLE',
  PAQUETE = 'PAQUETE',
}
```

### DTOs requeridos

```typescript
interface ListarProductosParams {
  page?: number;
  pageSize?: number;
  categoriaId?: string;
  disponibilidad?: DisponibilidadProducto;
  precioMin?: number;
  precioMax?: number;
  busqueda?: string;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

**Checklist**:
- [ ] `ProductoResumen`, `ProductoDetalle` con todos los campos
- [ ] `PaqueteDetalle`, `ComponentePaquete` existen
- [ ] `Categoria` con `id`, `nombre`, `descripcion`, `imagenUrl`
- [ ] Enums `DisponibilidadProducto`, `TipoProducto` definidos
- [ ] `ListarProductosParams` con todos los filtros
- [ ] `PaginatedResponse<T>` genérico
- [ ] Todo exportado vía barrel `index.ts`

---

## Paso 2: Verificar API Services en `shared/data-access`

```typescript
@Injectable({ providedIn: 'root' })
export class ProductosApiService {
  listar(params: ListarProductosParams): Observable<PaginatedResponse<ProductoResumen>>
  obtenerPorId(id: string): Observable<ProductoDetalle>
}

@Injectable({ providedIn: 'root' })
export class PaquetesApiService {
  obtenerPorId(id: string): Observable<PaqueteDetalle>
}

@Injectable({ providedIn: 'root' })
export class CategoriasApiService {
  listar(): Observable<Categoria[]>
}
```

**Checklist**:
- [ ] Todos inyectan `API_BASE_URL` y usan `buildHttpParams`
- [ ] Todo exportado vía barrel

---

## Paso 3: Verificar Shared UI Components

| Componente | Input principal | Usado en |
|-----------|-----------------|----------|
| `ProductCard` | `producto: ProductoResumen` | CatalogoPage, HomePage |
| `AvailabilityBadge` | `disponibilidad: DisponibilidadProducto` | CatalogoPage, DetailPages |
| `Pagination` | `page, totalPages` + `(pageChange)` | CatalogoPage |
| `LoadingSkeleton` | `tipo: 'card' \| 'detail' \| 'list'` | Todas las pages |
| `EmptyState` | `mensaje, icono` | CatalogoPage (sin resultados) |
| `PriceDisplay` | `precio: number, precioAnterior?: number` | DetailPages |
| `ImageGallery` | `imagenes: string[]` | DetailPages |
| `SearchInput` | `(search)` event | Header (shell) |

---

## Paso 4: Crear Estructura del Feature

```
features/catalogo/
├── catalogo-page/
│   ├── catalogo-page.component.ts
│   ├── catalogo-page.component.html
│   ├── catalogo-page.component.scss
│   └── catalogo-page.component.spec.ts
├── producto-detail-page/
├── paquete-detail-page/
├── categoria-page/
├── components/
│   ├── product-filters/
│   ├── product-grid/
│   └── sort-selector/
├── services/
│   └── catalogo-filter.store.ts
└── catalogo.routes.ts
```

- Cada page component es un **container** (smart component) — inyecta servicios, gestiona estado
- Los components internos son **presentational** (dumb) — solo `input()` y `output()`
- El store es local al feature — `@Injectable()` sin `providedIn`, provisto en el page component

---

## Paso 5: Crear el Local Filter Store

```typescript
@Injectable()
export class CatalogoFilterStore {
  private readonly _filtros = signal<ListarProductosParams>({ page: 1, pageSize: 12 });

  readonly filtros = this._filtros.asReadonly();
  readonly hayFiltrosActivos = computed(() => {
    const f = this._filtros();
    return !!(f.categoriaId || f.disponibilidad || f.precioMin || f.precioMax || f.busqueda);
  });

  actualizarFiltro(parcial: Partial<ListarProductosParams>): void {
    this._filtros.update((current) => ({ ...current, ...parcial, page: 1 }));
  }

  limpiarFiltros(): void {
    this._filtros.set({ page: 1, pageSize: 12 });
  }

  cambiarPagina(page: number): void {
    this._filtros.update((current) => ({ ...current, page }));
  }
}
```

**Decisiones de diseño**:
- `@Injectable()` sin `providedIn: 'root'` — store LOCAL al feature
- Se provee en `CatalogoPageComponent.providers`
- `actualizarFiltro()` resetea a `page: 1` siempre
- Signal de solo lectura con `.asReadonly()`

---

## Paso 6: Crear Componentes Internos (Presentational)

### ProductFilters

```typescript
@Component({
  selector: 'retail-product-filters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFiltersComponent {
  categorias = input.required<Categoria[]>();
  filtrosActuales = input.required<ListarProductosParams>();

  filtroChange = output<Partial<ListarProductosParams>>();
  limpiar = output<void>();
}
```

### ProductGrid

```typescript
@Component({
  selector: 'retail-product-grid',
  standalone: true,
  imports: [ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGridComponent {
  productos = input.required<ProductoResumen[]>();
  cargando = input(false);

  productoClick = output<ProductoResumen>();
}
```

### SortSelector

```typescript
@Component({
  selector: 'retail-sort-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortSelectorComponent {
  ordenActual = input<string>();
  direccionActual = input<'asc' | 'desc'>('asc');

  ordenChange = output<{ ordenarPor: string; direccion: 'asc' | 'desc' }>();
}
```

---

## Paso 7: Crear Page Components (Container)

### CatalogoPageComponent

```typescript
@Component({
  standalone: true,
  imports: [
    ProductGridComponent, ProductFiltersComponent, SortSelectorComponent,
    PaginationComponent, LoadingSkeletonComponent, EmptyStateComponent,
  ],
  providers: [CatalogoFilterStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogoPageComponent implements OnInit {
  private readonly productosApi = inject(ProductosApiService);
  private readonly categoriasApi = inject(CategoriasApiService);
  private readonly filterStore = inject(CatalogoFilterStore);
  private readonly router = inject(Router);

  readonly filtros = this.filterStore.filtros;
  readonly hayFiltrosActivos = this.filterStore.hayFiltrosActivos;
  readonly categorias = signal<Categoria[]>([]);
  readonly productos = signal<ProductoResumen[]>([]);
  readonly totalPages = signal(0);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  onFiltroChange(filtro: Partial<ListarProductosParams>): void {
    this.filterStore.actualizarFiltro(filtro);
    this.cargarProductos();
  }

  onProductoClick(producto: ProductoResumen): void {
    const ruta = producto.tipo === TipoProducto.PAQUETE
      ? ['paquete', producto.id]
      : ['producto', producto.id];
    this.router.navigate(ruta, { relativeTo: /* ... */ });
  }

  private cargarProductos(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.productosApi.listar(this.filtros()).subscribe({
      next: (res) => {
        this.productos.set(res.data);
        this.totalPages.set(res.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar productos');
        this.cargando.set(false);
      },
    });
  }
}
```

### Otras pages

- `ProductoDetailPageComponent` — recibe `:id`, usa `ProductosApiService.obtenerPorId()`
- `PaqueteDetailPageComponent` — mismo patrón con `PaquetesApiService.obtenerPorId()`
- `CategoriaPageComponent` — reutiliza lógica del catálogo con `categoriaId` pre-aplicado

---

## Paso 8: Definir Rutas

```typescript
export const catalogoRoutes: Routes = [
  { path: '', component: CatalogoPageComponent },
  { path: 'producto/:id', component: ProductoDetailPageComponent },
  { path: 'paquete/:id', component: PaqueteDetailPageComponent },
  { path: 'categoria/:id', component: CategoriaPageComponent },
];
```

- Sin lazy loading interno — los page components se importan directamente
- Lazy loading ocurre a nivel de `app.routes.ts` con `loadChildren()`
- Rutas relativas al path del feature (`/catalogo`)

---

## Paso 9: Tests

### Store

```typescript
describe('CatalogoFilterStore', () => {
  let store: CatalogoFilterStore;
  beforeEach(() => { store = new CatalogoFilterStore(); });

  it('should initialize with default filters', () => {
    expect(store.filtros()).toEqual({ page: 1, pageSize: 12 });
  });

  it('should reset page to 1 when updating filter', () => {
    store.cambiarPagina(3);
    store.actualizarFiltro({ categoriaId: 'cat-1' });
    expect(store.filtros().page).toBe(1);
  });

  it('should detect active filters', () => {
    expect(store.hayFiltrosActivos()).toBe(false);
    store.actualizarFiltro({ busqueda: 'test' });
    expect(store.hayFiltrosActivos()).toBe(true);
  });
});
```

### Container component

```typescript
describe('CatalogoPageComponent', () => {
  let productosApiSpy: jasmine.SpyObj<ProductosApiService>;

  beforeEach(() => {
    productosApiSpy = jasmine.createSpyObj('ProductosApiService', ['listar']);
    productosApiSpy.listar.and.returnValue(of({
      data: [], total: 0, page: 1, pageSize: 12, totalPages: 0,
    }));

    TestBed.configureTestingModule({
      imports: [CatalogoPageComponent],
      providers: [
        { provide: ProductosApiService, useValue: productosApiSpy },
        provideRouter([]),
      ],
    });
  });

  it('should load products on init', () => {
    const fixture = TestBed.createComponent(CatalogoPageComponent);
    fixture.detectChanges();
    expect(productosApiSpy.listar).toHaveBeenCalledWith({ page: 1, pageSize: 12 });
  });
});
```

---

## Paso 10: Verificar Lazy Loading

```typescript
// app.routes.ts — CORRECTO
{
  path: 'catalogo',
  loadChildren: () =>
    import('./features/catalogo/catalogo.routes').then((m) => m.catalogoRoutes),
}

// INCORRECTO — no usar paths de librería para features internas
// import('@retail/catalogo/routes')  ← NUNCA
```

**Verificación final**:
1. `/catalogo` carga los productos con loading skeleton
2. Los filtros modifican la búsqueda y resetean a página 1
3. Click en producto → `/catalogo/producto/:id`
4. Click en paquete → `/catalogo/paquete/:id`
5. `/catalogo/categoria/:id` muestra productos pre-filtrados
6. Todos los chunks se cargan lazy (verificar Network tab)
