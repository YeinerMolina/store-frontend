import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'retail-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  mensaje = input('No hay datos disponibles');
  accionLabel = input<string | null>(null);

  accionClick = output<void>();
}
