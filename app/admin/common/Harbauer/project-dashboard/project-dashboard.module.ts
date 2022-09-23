import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectDashboardRoutingModule } from './project-dashboard-routing.module';
import { ProjectDashboardComponent } from './project-dashboard.component';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { DateRangePickerModule } from "@syncfusion/ej2-angular-calendars";
import { TabViewModule } from "primeng/tabview";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { SelectButtonModule } from "primeng/selectbutton";
import {ToastModule} from 'primeng/toast';
import {DropdownModule} from 'primeng/dropdown';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
@NgModule({
  declarations: [ProjectDashboardComponent],
  imports: [
    CommonModule,
    ProjectDashboardRoutingModule,
    FormsModule,
    ProgressSpinnerModule,
    DateRangePickerModule,
    TabViewModule,
    DialogModule,
    TableModule,
    SelectButtonModule,
    ToastModule,
    DropdownModule,
    SliderModule,
    MultiSelectModule
  ]
})
export class ProjectDashboardModule { }
