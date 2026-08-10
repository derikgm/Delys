import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/pages/home-page.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // <-- Agrega { useHash: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }