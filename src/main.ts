// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';

import { AppModule } from './app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';



// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.getRegistrations().then(registrations => {
//         console.log('All service worker registrations:', registrations);
//       });
  
//       navigator.serviceWorker.register('/ngsw-worker.js')
//         .then(registration => {
//           console.log('Service Worker registered:', registration);
//         })
//         .catch(error => {
//           console.error('Service Worker registration failed:', error);
//         });
//     });
//   }

platformBrowserDynamic()
.bootstrapModule(AppModule)
.catch((err) => console.error(err));

// bootstrapApplication(AppModule, appConfig)
//   .catch((err) => console.error(err));
