import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  /** Canonical URL — omit for pages without a permanent URL */
  canonical?: string;
}

const SITE_NAME = 'Tienda';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(config: SeoConfig): void {
    this.title.setTitle(`${config.title} | ${SITE_NAME}`);
    this.meta.updateTag({ name: 'description', content: config.description });

    if (config.canonical) {
      this.meta.updateTag({ property: 'og:url', content: config.canonical });
    }

    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
  }

  reset(): void {
    this.update({
      title: 'Catálogo de Productos',
      description: 'Explorá nuestro catálogo. Encontrá lo que necesitás al mejor precio.',
    });
  }
}
