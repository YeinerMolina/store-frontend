import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

import { Disponibilidad } from '@retail/shared/domain';

@Component({
  selector: 'retail-availability-badge',
  standalone: true,
  templateUrl: './availability-badge.component.html',
  styleUrl: './availability-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityBadgeComponent {
  disponibilidad = input.required<Disponibilidad>();

  label = computed(() => {
    const labels: Record<Disponibilidad, string> = {
      [Disponibilidad.DISPONIBLE]: 'Disponible',
      [Disponibilidad.POCAS_UNIDADES]: 'Pocas unidades',
      [Disponibilidad.AGOTADO]: 'Agotado',
      [Disponibilidad.DESCONTINUADO]: 'Descontinuado',
    };
    return labels[this.disponibilidad()];
  });

  cssClass = computed(() => {
    const classes: Record<Disponibilidad, string> = {
      [Disponibilidad.DISPONIBLE]: 'badge--available',
      [Disponibilidad.POCAS_UNIDADES]: 'badge--low',
      [Disponibilidad.AGOTADO]: 'badge--out',
      [Disponibilidad.DESCONTINUADO]: 'badge--discontinued',
    };
    return classes[this.disponibilidad()];
  });
}
