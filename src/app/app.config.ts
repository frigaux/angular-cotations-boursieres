import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import themePrimeNG from '@primeng/themes/nora';
import {httpRequestInterceptor} from './http-request.interceptor';
import {httpResponseInterceptor} from './http-response.interceptor';
import {provideTranslateService} from "@ngx-translate/core";
import {definePreset} from '@primeng/themes';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {AppInitializerService} from './services/app-initializer/app-initializer-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideTranslateService({
      fallbackLang: 'fr'
    }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpRequestInterceptor, httpResponseInterceptor])
    ),
    provideAnimationsAsync(),
    provideAppInitializer(() => inject(AppInitializerService).prechaufferDnsEtHttp()),
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
    }),
    CurrencyPipe, DatePipe, DecimalPipe, PercentPipe
  ]
};
