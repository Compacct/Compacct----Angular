import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CompacctSchedulerComponent } from "./compacct.scheduler.component";

const CompacctSchedulerRoutes: Routes = [
  {
    path: "",
    component: CompacctSchedulerComponent,
    data: { title: "Appointment" }
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(CompacctSchedulerRoutes)],
  exports: [RouterModule]
})
export class CompacctSchedulerRouteModule {}
