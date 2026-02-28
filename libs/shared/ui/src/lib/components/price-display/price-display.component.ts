import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

import { formatCurrencyCOP } from '@retail/shared/util';

@Component({
  selector: 'retail-price-display',
  standalone: true,
  template: '<span class="price">{{ precioFormateado() }}</span>',
  styles: [`.price { font-weight: 700; color: #212121; font-size: 1.125rem; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceDisplayComponent {
  precio = input.required<number>();

  precioFormateado = computed(() => formatCurrencyCOP(this.precio()));
}
