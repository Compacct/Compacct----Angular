import { Directive, OnInit, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../compacct.services/common.api.service';
import * as moment from "moment";
import {NgModel} from '@angular/forms';
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[CompacctFinyearonly]',
    providers: [NgModel]
})
export class CompacctFinyearwisedateDirective implements OnInit {
  FinDetails = [];
  DocDate: string;
  private elRef:any;

  @Output() ngModelChange = new EventEmitter();
  constructor(private elem: ElementRef,
    private _renderer: Renderer2,
    private model:NgModel,
    private $http: HttpClient,
    private commonApi: CompacctCommonApi) {
      console.log(this.DocDate)
      this.elRef = this.elem.nativeElement;
     }
    ngOnInit() {
      this.GetFinDetails();
    }
  GetFinDetails() {
    const fin = JSON.parse(localStorage.getItem('Fin'));
    if(fin[0].Fin_Year_Name) {
          this.FinDetails = fin[0];
        const StartDate = new Date(this.FinDetails['Fin_Year_Start']);
        const EndDate =new Date(this.FinDetails['Fin_Year_End']);
        const today = new Date();
        this._renderer.setAttribute(this.elRef, "min",moment(new Date(this.FinDetails['Fin_Year_Start'])).format("YYYY-MM-DD"));
        this._renderer.setAttribute(this.elRef, "max",moment(new Date(this.FinDetails['Fin_Year_End'])).format("YYYY-MM-DD"));

        if ((today > StartDate) && (today < EndDate)) {

        } else{
          const endDate = moment(new Date(this.FinDetails['Fin_Year_End'])).format("YYYY-MM-DD");
          this.elRef.value = endDate;
          this.ngModelChange.emit(this.elRef.value);
          this.model.valueAccessor.writeValue(endDate);
          this.model.viewToModelUpdate(endDate);
          this.model.model = endDate;
          console.log(this.model)
        }

    }
  }

}
