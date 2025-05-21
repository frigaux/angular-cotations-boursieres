import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import themePrimeNG from '@primeng/themes/aura';
import {httpRequestInterceptor} from './http-request.interceptor';
import {httpResponseInterceptor} from './http-response.interceptor';
import {provideTranslateService} from "@ngx-translate/core";
import {definePreset} from '@primeng/themes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideTranslateService({
      defaultLanguage: 'fr'
    }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpRequestInterceptor, httpResponseInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: definePreset(themePrimeNG, {
          semantic: {
            primary: {
              50: '{blue.50}',
              100: '{blue.100}',
              200: '{blue.200}',
              300: '{blue.300}',
              400: '{blue.400}',
              500: '{blue.500}',
              600: '{blue.600}',
              700: '{blue.700}',
              800: '{blue.800}',
              900: '{blue.900}',
              950: '{blue.950}'
            }
          }
        })
      }
    })
  ]
};
