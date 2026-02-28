# Manejo de Errores

> Parte de la [Arquitectura Frontend](./CLAUDE_ARQUITECTURA.md)

---

## 1. Estrategia por Capa

| Capa | Responsabilidad | Qué hace |
|------|----------------|----------|
| **Interceptor** | Errores HTTP transversales | 401 → redirige a login. Los demás → propaga al caller. |
| **Servicio API** | Nada (por defecto) | Deja que el error fluya al componente. Excepción: 404 puede transformarse a `null` cuando tiene sentido semántico (ej: "no hay carrito activo"). |
| **Componente** | Muestra feedback al usuario | Usa `ErrorStateComponent` para errores de carga. Usa mensajes inline para errores de formulario. Nunca muestra stacktraces ni códigos HTTP. |

---

## 2. Patrón en Componentes

```typescript
export class CatalogoPageComponent implements OnInit {
  private productosApi = inject(ProductosApiService);
  private filterStore = inject(CatalogoFilterStore);

  productos = signal<ProductoResumen[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productosApi.listar(this.filterStore.filtros()).subscribe({
      next: (response) => {
        this.productos.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No pudimos cargar los productos. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }
}
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

---

## 3. Mensajes de Error al Usuario

| Error HTTP | Mensaje al usuario | Acción |
|-----------|-------------------|--------|
| 400 (validación) | Mostrar errores de campo del backend | Highlight en formulario |
| 401 | (interceptor redirige a login) | — |
| 403 | "No tienes permiso para realizar esta acción" | — |
| 404 | "Este producto ya no está disponible" | Link al catálogo |
| 409 (conflicto) | Mensaje específico del backend | — |
| 500 | "Ocurrió un error inesperado. Intenta de nuevo." | Botón reintentar |
| Network error | "No pudimos conectarnos. Verifica tu conexión." | Botón reintentar |

**Nunca mostrar**: status codes, mensajes técnicos del backend, stacktraces.
