# @retail/shared/domain — Models, Enums, DTOs

**Purpose**: TypeScript interfaces, enums, and DTOs representing data contracts between frontend and backend. The "contract" with the API.

**Tags**: `scope:shared`, `type:domain`

**Allowed Dependencies**: NONE. This is the base layer.

**Import Path**: `@retail/shared/domain`

## Principles

- Only interfaces and enums. NO classes, NO logic, NO Angular imports.
- Models reflect API responses, not internal backend structure.
- Separate "resumen" (list) from "detalle" (detail) when listing returns fewer fields.
- DTOs represent HTTP request bodies.

## Structure

```
src/lib/
├── models/
│   ├── producto.model.ts       # ProductoResumen, ProductoDetalle
│   ├── paquete.model.ts        # PaqueteDetalle, ComponentePaquete
│   ├── categoria.model.ts      # Categoria
│   ├── empleado.model.ts       # EmpleadoResumen
│   ├── inventario.model.ts     # StockProducto, MovimientoInventario
│   ├── parametro.model.ts      # Parametro
│   └── auth.model.ts           # AuthResponse, LoginCredentials
├── enums/
│   ├── estado-producto.enum.ts # ACTIVO, DESCONTINUADO
│   ├── disponibilidad.enum.ts  # DISPONIBLE, POCAS_UNIDADES, AGOTADO, DESCONTINUADO
│   ├── tipo-movimiento.enum.ts # ENTRADA, SALIDA, AJUSTE
│   └── tipo-ajuste.enum.ts     # OPERATIVO, CONTABLE
├── dtos/
│   ├── crear-producto.dto.ts
│   ├── actualizar-producto.dto.ts
│   ├── listar-productos-params.dto.ts
│   ├── crear-paquete.dto.ts
│   ├── registrar-movimiento.dto.ts
│   ├── login.dto.ts
│   └── paginated-response.dto.ts  # PaginatedResponse<T> generic
└── index.ts
```

## Cross-References

- `../../../CLAUDE.md` — workspace conventions
