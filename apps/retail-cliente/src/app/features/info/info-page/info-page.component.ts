import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'retail-info-page',
  standalone: true,
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPageComponent {}
