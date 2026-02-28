import { Routes } from '@angular/router';

import { InventarioPageComponent } from './inventario-page/inventario-page.component';
import { MovimientosPageComponent } from './movimientos-page/movimientos-page.component';

export const inventarioRoutes: Routes = [
  { path: '', component: InventarioPageComponent },
  { path: 'movimientos', component: MovimientosPageComponent },
];
