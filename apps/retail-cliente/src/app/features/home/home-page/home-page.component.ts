import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'retail-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
