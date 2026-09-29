import { bootstrapApplication } from '@angular/platform-browser';
import { configuracionApp } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, configuracionApp).catch((error) => console.error(error));
