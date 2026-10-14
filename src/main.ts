import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// The historial de visitantes table pipes dates through 'es-CO', so the locale
// data must be registered or DatePipe throws NG02100 and the row never renders.
registerLocaleData(localeEsCO, 'es-CO');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));