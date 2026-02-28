# Comunicación con el Backend

> Parte de la [Arquitectura Frontend](./CLAUDE_ARQUITECTURA.md)

---

## 1. Configuración Base

```typescript
// apps/retail-cliente/src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
  ],
};

// apps/retail-empleado/src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
  ],
};
```

**Diferencia clave**: La app cliente NO usa `authInterceptor` en el MVP (no hay login de clientes). La app empleado lo incluye para inyectar el JWT en cada request.

---

## 2. Interceptores

### Auth Interceptor (solo app empleado)

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};
```

### Error Interceptor (ambas apps)

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authStore.clearAuth();
        router.navigate(['/login']);
      }
      // 403, 404, 5xx → se propagan al componente que hizo la llamada
      return throwError(() => error);
    })
  );
};
```

---

## 3. Patrón de Servicio API

```typescript
@Injectable({ providedIn: 'root' })
export class ProductosApiService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  // Endpoints públicos (vitrina)
  listar(params: ListarProductosParams): Observable<PaginatedResponse<ProductoResumen>> {
    const httpParams = buildHttpParams(params);
    return this.http.get<PaginatedResponse<ProductoResumen>>(
      `${this.baseUrl}/catalogo/productos`,
      { params: httpParams }
    );
  }

  obtenerPorId(id: string): Observable<ProductoDetalle> {
    return this.http.get<ProductoDetalle>(`${this.baseUrl}/catalogo/productos/${id}`);
  }

  // Endpoints protegidos (backoffice)
  crear(dto: CrearProductoDto): Observable<ProductoDetalle> {
    return this.http.post<ProductoDetalle>(`${this.baseUrl}/catalogo/productos`, dto);
  }

  actualizar(id: string, dto: ActualizarProductoDto): Observable<ProductoDetalle> {
    return this.http.patch<ProductoDetalle>(`${this.baseUrl}/catalogo/productos/${id}`, dto);
  }

  cambiarEstado(id: string, estado: EstadoProducto): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/catalogo/productos/${id}/estado`, { estado });
  }
}
```

**Principios**:
- Todos `providedIn: 'root'` (singleton, tree-shakeable)
- Usan `inject(HttpClient)` e `inject(API_BASE_URL)`
- Retornan `Observable<T>` con tipos del `shared/domain`
- No manejan errores internamente; los errores fluyen al interceptor
- Endpoints públicos y protegidos conviven en el mismo servicio

---

## 4. Mapeo de URLs de API

| Backend endpoint | Servicio frontend | Método |
|-----------------|-------------------|--------|
| `GET /api/catalogo/productos` | `ProductosApiService.listar()` | GET con query params |
| `GET /api/catalogo/productos/:id` | `ProductosApiService.obtenerPorId()` | GET |
| `POST /api/catalogo/productos` | `ProductosApiService.crear()` | POST con body |
| `PATCH /api/catalogo/productos/:id` | `ProductosApiService.actualizar()` | PATCH con body parcial |
| `GET /api/catalogo/categorias` | `CategoriasApiService.listar()` | GET |
| `GET /api/inventario/stock/:productoId` | `InventarioApiService.obtenerStock()` | GET |
| `POST /api/inventario/movimientos` | `InventarioApiService.registrarMovimiento()` | POST |
| `POST /api/auth/login` | `AuthApiService.login()` | POST |
| `POST /api/auth/refresh` | `AuthApiService.refresh()` | POST |
