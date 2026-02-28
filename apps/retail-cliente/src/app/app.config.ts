import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withNavigationErrorHandler,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { API_BASE_URL, errorInterceptor } from '@retail/shared/data-access';

import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withNavigationErrorHandler((error) => console.error('Navigation error:', error)),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor]),
    ),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
  ],
};
