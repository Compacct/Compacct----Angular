import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { ProjectDashboardComponent } from './project-dashboard.component';

const routes: Routes = [
  {
    path: "",
    component: ProjectDashboardComponent,
    data: { title: "Project Dashboard" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectDashboardRoutingModule { }
