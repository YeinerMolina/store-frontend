# Validaciones desde el Frontend

> Parte de la [Arquitectura Frontend](./CLAUDE_ARQUITECTURA.md)

---

## 1. Principio

El frontend valida **formato y completitud** para dar feedback inmediato al usuario. Las reglas de negocio las valida el backend. Si un formulario pasa validación del frontend pero falla en el backend, se muestran los errores del backend en el formulario.

---

## 2. Validaciones del MVP

### Formulario de Producto (empleado)

| Campo | Validación frontend | Validación backend |
|-------|--------------------|-------------------|
| Nombre | Requerido, min 3 chars, max 200 chars | Unicidad |
| Descripción | Requerido, max 2000 chars | — |
| Precio | Requerido, > 0, numérico | Precio positivo (invariante dominio) |
| Categoría | Requerido (select) | Categoría existe y está activa |
| Imágenes | Al menos 1, formatos (jpg/png/webp), tamaño max | Procesamiento y storage |
| Estado | Requerido (select) | Transición válida |

### Formulario de Paquete (empleado)

| Campo | Validación frontend | Validación backend |
|-------|--------------------|-------------------|
| Nombre | Requerido, min 3 chars | — |
| Precio | Requerido, > 0 | Precio positivo |
| Componentes | Al menos 1, cantidad > 0 por cada uno | Productos existen y están activos |

### Formulario de Ajuste de Inventario (empleado)

| Campo | Validación frontend | Validación backend |
|-------|--------------------|-------------------|
| Producto | Requerido (select/autocomplete) | Producto existe |
| Cantidad | Requerido, entero, > 0 | Stock suficiente (si es salida) |
| Tipo de ajuste | Requerido (operativo/contable) | — |
| Motivo | Requerido, min 10 chars | — |

---

## 3. Patrón de Formulario con Reactive Forms

```typescript
export class ProductoFormPageComponent {
  private fb = inject(FormBuilder);
  private productosApi = inject(ProductosApiService);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    descripcion: ['', [Validators.required, Validators.maxLength(2000)]],
    precio: [0, [Validators.required, Validators.min(1)]],
    categoriaId: ['', Validators.required],
    esElegibleParaCambio: [true],
  });

  serverErrors = signal<Record<string, string>>({});
  submitting = signal(false);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.serverErrors.set({});

    this.productosApi.crear(this.form.getRawValue()).subscribe({
      next: () => {
        // Navegar a lista con mensaje de éxito
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        if (err.status === 400 && err.error?.errors) {
          this.serverErrors.set(err.error.errors);
        }
      },
    });
  }
}
```

**Patrón dual de errores**: Los formularios tienen DOS capas de error display que comparten los mismos slots de UI — errores de validación frontend (Angular Validators) y errores del backend (400 response).
