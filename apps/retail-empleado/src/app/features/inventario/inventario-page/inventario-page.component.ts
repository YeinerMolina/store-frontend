import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'retail-inventario-page',
  standalone: true,
  templateUrl: './inventario-page.component.html',
  styleUrl: './inventario-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioPageComponent {}
