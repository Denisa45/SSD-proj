/*import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// ✅ AngularFire imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAfV2w6KpVePZ6FEjSBsdkltayjQ74nUtw",
  authDomain: "studyplanner2-676f9.firebaseapp.com",
  projectId: "studyplanner2-676f9",
  storageBucket: "studyplanner2-676f9.firebasestorage.app",
  messagingSenderId: "619989503475",
  appId: "1:619989503475:web:2effce2a7c433d7bed5686",
  measurementId: "G-KHKHS4LSVH"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // ✅ Register Firebase services for Angular
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};
*/
// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ]
};
