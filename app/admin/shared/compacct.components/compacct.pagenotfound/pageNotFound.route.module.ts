import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './pageNotFound.component';

const routes: Routes = [
  { path: '', component: PageNotFoundComponent, data: {title: 'Page Not Found'}
 },
];

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageNotFoundModule {}
