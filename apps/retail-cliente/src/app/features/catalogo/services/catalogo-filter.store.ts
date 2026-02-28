import { Injectable, computed, signal } from '@angular/core';
import { ListarProductosParams } from '@retail/shared/domain';

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
