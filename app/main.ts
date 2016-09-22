import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { InjectedAppComponent } from './app.component';
import { AppModule } from './app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);