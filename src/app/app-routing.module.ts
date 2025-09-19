import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CallbackComponent } from './auth/callback.component';

const routes: Routes = [
  { path: 'callback', component: AppComponent  }, // redirect target
  { path: '', component: AppComponent },          // default
  // { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
