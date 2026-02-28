import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'retail-error-state',
  standalone: true,
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  mensaje = input('Ocurrió un error inesperado');

  reintentar = output<void>();
}
