import { Routes } from '@angular/router';

import { ShellComponent } from './shell/shell.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.homeRoutes),
      },
      {
        path: 'catalogo',
        loadChildren: () =>
          import('./features/catalogo/catalogo.routes').then((m) => m.catalogoRoutes),
      },
      {
        path: 'info',
        loadChildren: () =>
          import('./features/info/info.routes').then((m) => m.infoRoutes),
      },
    ],
  },
];
