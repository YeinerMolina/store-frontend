# Gestión de Estado

> Parte de la [Arquitectura Frontend](./CLAUDE_ARQUITECTURA.md)

---

## 1. Criterio: ¿Dónde vive el estado?

| Tipo de estado | Dónde | Mecanismo | Ejemplo |
|---------------|-------|-----------|---------|
| **UI de un componente** | En el componente | `signal()` | Toggle de sidebar, campo de formulario |
| **Estado de un feature** | En el feature (service/store) | Servicio con signals | Filtros activos del catálogo, página actual |
| **Estado global de app** | `shared/data-access/state/` | Servicio singleton con signals | Token de auth, usuario logueado |
| **Datos del servidor** | No se almacenan globalmente (MVP) | Fetch on demand via servicios API | Lista de productos, detalle de producto |

---

## 2. Patrón de Store con Signals

### Store global (singleton)

```typescript
// libs/shared/data-access/src/services/state/auth.store.ts
@Injectable({ providedIn: 'root' })
export class AuthStore {
  // Estado interno (writable)
  private _token = signal<string | null>(null);
  private _empleado = signal<EmpleadoResumen | null>(null);

  // Estado público (readonly)
  readonly token = this._token.asReadonly();
  readonly empleado = this._empleado.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly nombreEmpleado = computed(() => this._empleado()?.nombre ?? '');

  // Acciones
  setAuth(token: string, empleado: EmpleadoResumen): void {
    this._token.set(token);
    this._empleado.set(empleado);
  }

  clearAuth(): void {
    this._token.set(null);
    this._empleado.set(null);
  }
}
```

### Store local (scoped a feature)

```typescript
// features/catalogo/services/catalogo-filter.store.ts
@Injectable()  // NO providedIn root — local al feature
export class CatalogoFilterStore {
  private _filtros = signal<ListarProductosParams>({ page: 1, pageSize: 12 });

  readonly filtros = this._filtros.asReadonly();
  readonly hayFiltrosActivos = computed(() => {
    const f = this._filtros();
    return !!(f.categoriaId || f.disponibilidad || f.precioMin || f.precioMax || f.busqueda);
  });

  actualizarFiltro(parcial: Partial<ListarProductosParams>): void {
    this._filtros.update(current => ({ ...current, ...parcial, page: 1 }));
  }

  limpiarFiltros(): void {
    this._filtros.set({ page: 1, pageSize: 12 });
  }

  cambiarPagina(page: number): void {
    this._filtros.update(current => ({ ...current, page }));
  }
}
```

---

## 3. Qué NO Hacer con Estado

- **No crear stores globales para datos de servidor en el MVP.** Cada componente que necesita productos hace `productosApiService.listar()`. No hay caché client-side en un store global. Reconsiderar post-MVP si hay problemas de rendimiento.
- **No usar NgRx, NGXS ni similares en el MVP.** Los signals de Angular son suficientes para un equipo de 1-2 devs.
- **No almacenar el JWT en localStorage.** Usar cookies HttpOnly (el backend las envía). El `AuthStore` solo guarda estado "estoy autenticado" para la UI, no el token raw.
