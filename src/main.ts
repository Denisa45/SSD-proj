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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LucideIconModule } from './app/icons.config';

import { authInterceptor } from './app/auth.interceptor';   // ✅ import interceptor

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(LucideIconModule),
    provideAnimations(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // ✅ ENABLE TOKEN INTERCEPTOR
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
}).catch(err => console.error(err));
