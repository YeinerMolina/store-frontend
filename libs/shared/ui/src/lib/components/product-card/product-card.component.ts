import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

import { ProductoResumen, Disponibilidad } from '@retail/shared/domain';
import { formatCurrencyCOP } from '@retail/shared/util';

import { PriceDisplayComponent } from '../price-display/price-display.component';
import { AvailabilityBadgeComponent } from '../availability-badge/availability-badge.component';

@Component({
  selector: 'retail-product-card',
  standalone: true,
  imports: [PriceDisplayComponent, AvailabilityBadgeComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  producto = input.required<ProductoResumen>();

  cardClick = output<string>();

  onCardClick(): void {
    this.cardClick.emit(this.producto().id);
  }
}
