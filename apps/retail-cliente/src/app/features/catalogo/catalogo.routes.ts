import { Routes } from '@angular/router';

import { CatalogoPageComponent } from './catalogo-page/catalogo-page.component';
import { ProductoDetailPageComponent } from './producto-detail-page/producto-detail-page.component';
import { PaqueteDetailPageComponent } from './paquete-detail-page/paquete-detail-page.component';
import { CategoriaPageComponent } from './categoria-page/categoria-page.component';

export const catalogoRoutes: Routes = [
  { path: '', component: CatalogoPageComponent },
  { path: 'producto/:id', component: ProductoDetailPageComponent },
  { path: 'paquete/:id', component: PaqueteDetailPageComponent },
  { path: 'categoria/:id', component: CategoriaPageComponent },
];
