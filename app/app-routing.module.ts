
import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/Auth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [

  { path: '',
  component: AppComponent ,
  data: {title: 'Home'},
  children : [
    {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/layout.module').then(m => m.LayoutModule),
    data: { title: 'Dashboard' }
  },
  { path: '**',
    pathMatch: 'full',
    redirectTo: '' }
    ]}
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
