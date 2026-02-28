import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'retail-producto-detail-page',
  standalone: true,
  templateUrl: './producto-detail-page.component.html',
  styleUrl: './producto-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoDetailPageComponent {}
