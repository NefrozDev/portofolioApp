import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app/app';
import { serverConfig } from './app/components/app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, serverConfig, context);

export default bootstrap;
