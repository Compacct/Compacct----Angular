import {
  NgModule,
  Directive,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input,
  ElementRef,
  Renderer
} from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompacctDigitonlyDirective } from "./compacct.directives/compacct.digitonly.directive";
import { CompacctGooglePlacesDirective } from "./compacct.directives/compacct.place.directive";
import { CompacctHearingThresholdChartComponent } from "./compacct.components/compacct.hearing.threshold-chart/compacct.hearing.threshold-chart.component";
import { CompacctFinyearwisedateDirective } from './compacct.directives/compacct.finyearwisedate.directive';
import { CompacctNepaliDatepickerDirective } from './compacct.directives/compacct-nepali-datepicker.directive';




@NgModule({
  imports: [],
  declarations: [CompacctDigitonlyDirective, CompacctGooglePlacesDirective,CompacctFinyearwisedateDirective, CompacctNepaliDatepickerDirective],
  exports: [CompacctDigitonlyDirective,CompacctNepaliDatepickerDirective, CompacctGooglePlacesDirective,CompacctFinyearwisedateDirective]
})
export class SharedModule {}
