import { Routes } from '@angular/router';

import { ProductoListPageComponent } from './producto-list-page/producto-list-page.component';
import { ProductoFormPageComponent } from './producto-form-page/producto-form-page.component';
import { PaqueteListPageComponent } from './paquete-list-page/paquete-list-page.component';
import { PaqueteFormPageComponent } from './paquete-form-page/paquete-form-page.component';
import { CategoriaListPageComponent } from './categoria-list-page/categoria-list-page.component';
import { CategoriaFormPageComponent } from './categoria-form-page/categoria-form-page.component';

export const productosRoutes: Routes = [
  { path: '', component: ProductoListPageComponent },
  { path: 'nuevo', component: ProductoFormPageComponent },
  { path: ':id/editar', component: ProductoFormPageComponent },
  { path: 'paquetes', component: PaqueteListPageComponent },
  { path: 'paquetes/nuevo', component: PaqueteFormPageComponent },
  { path: 'paquetes/:id/editar', component: PaqueteFormPageComponent },
  { path: 'categorias', component: CategoriaListPageComponent },
  { path: 'categorias/nueva', component: CategoriaFormPageComponent },
  { path: 'categorias/:id/editar', component: CategoriaFormPageComponent },
];
