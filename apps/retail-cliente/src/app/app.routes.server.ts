import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Static page — always the same content, no dynamic data
    path: 'info',
    renderMode: RenderMode.Prerender,
  },
  {
    // Home uses SSR so featured products are always fresh
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    // All catalog routes are SSR (product data changes)
    path: 'catalogo/**',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
