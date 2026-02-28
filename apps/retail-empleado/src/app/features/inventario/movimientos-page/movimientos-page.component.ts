import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'retail-movimientos-page',
  standalone: true,
  templateUrl: './movimientos-page.component.html',
  styleUrl: './movimientos-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientosPageComponent {}
