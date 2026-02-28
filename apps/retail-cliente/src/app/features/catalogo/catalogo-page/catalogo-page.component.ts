import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'retail-catalogo-page',
  standalone: true,
  templateUrl: './catalogo-page.component.html',
  styleUrl: './catalogo-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogoPageComponent {}
