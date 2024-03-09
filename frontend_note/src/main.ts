import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app/app.config';
import { ListComponent } from './app/list/list.component';
import { AppComponent } from './app/app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
