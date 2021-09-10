import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { DashBoardComponent } from "./dashBoard.component";

const routes: Routes = [
  {
    path: "",
    component: DashBoardComponent,
    data: { title: "Bussiness Dashboard" }
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashBoardRouteModule {}
