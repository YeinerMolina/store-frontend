# Decisiones de Arquitectura — retail-empleado

> Decisiones exclusivas del backoffice. Para arquitectura compartida ver [docs compartidos](./arquitectura/).

---

## 1. Features dentro de la app, no como Nx libs

Features son exclusivos de esta app (no se reutilizan con retail-cliente). Mantenerlos como directorios internos reduce overhead:

- No `project.json` por feature
- No path aliases por feature
- No barrel exports por feature

Si un feature necesita compartirse entre apps, ENTONCES promoverlo a lib Nx. No antes.

---

## 2. Estructura interna de features

```
features/{name}/
├── {name}-page/            # Page component (routable entry point)
├── components/              # Componentes internos (no routable)
├── services/                # Estado local (si necesario)
└── {name}.routes.ts         # Lazy routes
```

Cada feature es auto-contenido. El page component es el entry point routable. Los components internos solo se usan dentro del feature.

---

## 3. Arquitectura de Auth

- `authGuard` es un functional guard en `core/guards/`
- Login route FUERA del shell (sin layout)
- Todas las demás rutas son hijas del shell + protegidas por `authGuard`
- Estado de auth via `AuthStore` (singleton con signals)
- JWT en HttpOnly cookies — el frontend NUNCA toca el token raw
- `authInterceptor` deja que el browser envíe cookies automáticamente; NO attachea tokens manualmente
- `errorInterceptor` captura 401 → limpia auth state → redirige a `/login`

---

## 4. Enfoque de Validación

**Frontend valida**:
- Campos requeridos
- Min/max length
- Rangos numéricos
- Formato (email, teléfono, patrón SKU)

**Backend valida**:
- Reglas de negocio: unicidad, existencia, transiciones de estado válidas, stock suficiente

**Patrón**:
1. Reactive Forms con Angular `Validators`
2. On submit → llamar API service
3. On 400 error → mapear errores del servidor a los form controls
4. Mostrar mensajes del servidor inline (mismo lugar que validación frontend)

Esto significa que los formularios tienen DOS capas de errores que comparten los mismos slots de UI.

---

## 5. El feature productos es deliberadamente grande

Maneja productos, paquetes Y categorías CRUD en un solo directorio. Esto es intencional:

- Productos, paquetes y categorías son conceptos de dominio estrechamente relacionados
- Comparten contexto de navegación (el usuario se mueve entre ellos fluidamente)
- Dividir prematuramente crearía fronteras artificiales

**Cuándo dividir**: Si el feature crece más allá de ~10 componentes o 3+ páginas con lógica muy diferente. Dividir es barato — son solo directorios, no requiere reestructuración Nx.
