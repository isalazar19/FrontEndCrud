/*
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
//import { appConfig } from './app/app.config';
//import { App } from './app/app';

//bootstrapApplication(App, appConfig)
//  .catch((err) => console.error(err));
bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
*/
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    // otros providers globales si tienes
  ]
}).catch(err => console.error(err));
