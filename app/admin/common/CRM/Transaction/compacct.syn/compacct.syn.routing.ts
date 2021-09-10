import { NgModule, Component  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';
import { CompacctSynComponent } from './compacct.syn.component';

const CompacctSynRoutes: Routes = [
    { path: '',
      component: CompacctSynComponent ,
      data: {title: 'Appointment'}  }
  ];

  @NgModule({
      declarations: [],
    imports: [CommonModule, RouterModule.forChild(CompacctSynRoutes)],
    exports: [RouterModule]
})
export class CompacctSynRouteModule {
}
