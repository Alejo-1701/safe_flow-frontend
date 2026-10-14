import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// Must also be registered on the server: prerendering pipes dates through
// 'es-CO', and without the locale data DatePipe throws NG02100 mid-render.
registerLocaleData(localeEsCO, 'es-CO');

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;