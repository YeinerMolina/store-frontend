import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'retail-paquete-list-page',
  standalone: true,
  templateUrl: './paquete-list-page.component.html',
  styleUrl: './paquete-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaqueteListPageComponent {}
