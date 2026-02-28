import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStore {
  private readonly _sidebarOpen = signal(true);
  private readonly _loading = signal(false);

  readonly sidebarOpen = this._sidebarOpen.asReadonly();
  readonly loading = this._loading.asReadonly();

  toggleSidebar(): void {
    this._sidebarOpen.update((open) => !open);
  }

  setSidebarOpen(open: boolean): void {
    this._sidebarOpen.set(open);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
}
