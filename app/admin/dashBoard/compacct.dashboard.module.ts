import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { DashBoardRouteModule } from "./dashBoard.route.module";
import { DashBoardComponent } from "./dashBoard.component";
import { ChartModule } from "primeng/chart";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { DateRangePickerModule } from "@syncfusion/ej2-angular-calendars";
import { CompacctDaterangepickerChartComponent } from "./compacct-daterangepicker-chart/compacct-daterangepicker.chart";
import { CompacctChartComponent } from "../shared/compacct.components/compacct-chart/compacct-chart.component";
import { TabViewModule } from "primeng/tabview";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { SelectButtonModule } from "primeng/selectbutton";

@NgModule({
  declarations: [
    DashBoardComponent,
    CompacctChartComponent,
    CompacctDaterangepickerChartComponent
  ],
  imports: [
    CommonModule,
    TabViewModule,
    TableModule,
    ProgressSpinnerModule,
    DateRangePickerModule,
    SelectButtonModule,
    ChartModule,
    FormsModule,
    DialogModule,
    DashBoardRouteModule
  ]
})
export class CompacctDashboardModule {}
