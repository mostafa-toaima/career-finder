import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';

// ✅ Move Firebase Config Outside for Clarity
const firebaseConfig = {
  projectId: "graduation-project-704b9",
  appId: "1:159614579205:web:c0dfd56cf057d7635ce26c",
  storageBucket: "graduation-project-704b9.appspot.com",
  apiKey: "AIzaSyCJhh6RhbGA52js5L1blEEU0EF_pTy1-JU",
  authDomain: "graduation-project-704b9.firebaseapp.com",
  messagingSenderId: "159614579205",
  measurementId: "G-K9DF60BE90"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),

    // ✅ Ensure Firebase is initialized before using services
    provideFirebaseApp(() => {
      const app = initializeApp(firebaseConfig);
      return app;
    }),

    // ✅ Fix: Directly get services without calling getApp()
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideVertexAI(() => getVertexAI()),

    // ✅ Fix AppCheck Provider
    provideAppCheck(() => {
      const provider = new ReCaptchaEnterpriseProvider("your-site-key");
      return initializeAppCheck(getApp(), { provider, isTokenAutoRefreshEnabled: true });
    }),

    ScreenTrackingService,
    UserTrackingService
  ]
};
