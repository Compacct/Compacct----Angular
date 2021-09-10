import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "./../../../../shared/compacct.shared.module";

// PRIME COMPONENTS
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { MenuModule } from "primeng/menu";
import { FullCalendarModule } from "@fullcalendar/angular";
// import {FullCalendarModule} from 'primeng/fullcalendar';
import { DialogModule } from "primeng/dialog";
// import {ButtonModule} from 'primeng/button';
import { FieldsetModule } from "primeng/fieldset";
import { SelectButtonModule } from "primeng/selectbutton";
import { SidebarModule } from "primeng/sidebar";
import { InputMaskModule } from "primeng/inputmask";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { RatingModule } from "primeng/rating";

import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctSchedulerRouteModule } from "./compacct.scheduler.routing";
import { CompacctSchedulerComponent } from "./compacct.scheduler.component";
import { ScheduleAllModule } from "@syncfusion/ej2-angular-schedule";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ContextMenuModule } from "@syncfusion/ej2-angular-navigations";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
import {
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  MonthAgendaService,
  TimelineViewsService,
  TimelineMonthService
} from "@syncfusion/ej2-angular-schedule";

// import { CompacctCommonApi } from '../../services/common.compacct/common.api.service';

@NgModule({
  declarations: [CompacctSchedulerComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FullCalendarModule,
    ScheduleAllModule,
    DatePickerModule,
    ContextMenuModule,
    CompacctSchedulerRouteModule,
    TabViewModule,
    SidebarModule,
    DropdownModule,
    MultiSelectModule,
    SelectButtonModule,
    DialogModule,
    OverlayPanelModule,
    ButtonModule,
    ToastModule,
    RatingModule,
    InputMaskModule,
    FieldsetModule
  ],
  exports: [],
  providers: [
    DateTimeConvertService,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    TimelineViewsService,
    TimelineMonthService
  ]
})
export class CompacctSchedulerModule {}
