import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'retail-producto-list-page',
  standalone: true,
  templateUrl: './producto-list-page.component.html',
  styleUrl: './producto-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoListPageComponent {}
