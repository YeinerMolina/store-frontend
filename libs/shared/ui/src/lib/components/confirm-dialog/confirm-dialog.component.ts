import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'retail-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  titulo = input('Confirmar acción');
  mensaje = input('¿Estás seguro?');
  confirmLabel = input('Confirmar');
  cancelLabel = input('Cancelar');

  confirmar = output<void>();
  cancelar = output<void>();
}
