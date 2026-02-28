import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { AuthStore } from '@retail/shared/data-access';

@Component({
  selector: 'retail-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authStore = inject(AuthStore);

  readonly nombreEmpleado = this.authStore.nombreEmpleado;
}
