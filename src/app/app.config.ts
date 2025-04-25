import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebaseConfig);
      return app;
    }),

    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    // provideDatabase(() => getDatabase()), if we need use realtime database
    // provideFunctions(() => getFunctions()),
    // provideMessaging(() => getMessaging()),
    // providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    // provideRemoteConfig(() => getRemoteConfig()),
    // provideVertexAI(() => getVertexAI()),

    // provideAppCheck(() => {
    //   const provider = new ReCaptchaEnterpriseProvider("your-site-key");
    //   return initializeAppCheck(getApp(), { provider, isTokenAutoRefreshEnabled: true });
    // }),

    ScreenTrackingService,
    UserTrackingService,
    provideHttpClient(withInterceptorsFromDi())

  ]
};
