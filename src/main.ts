import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app-component/app-component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { LucideIconModule } from './app/icons.config'; // 👈 add this


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(LucideIconModule),
    provideAnimations(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));
