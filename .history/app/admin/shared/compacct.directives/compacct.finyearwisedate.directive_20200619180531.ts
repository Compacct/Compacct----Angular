import { Directive, OnInit, ElementRef, Renderer2, Output, EventEmitter, Renderer, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../compacct.services/common.api.service';
import * as moment from "moment";
import {NgModel} from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
export const DATE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessor),
  multi: true
};
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[CompacctFinyearonly]',
    providers: [DATE_VALUE_ACCESSOR]
})
export class CompacctFinyearwisedateDirective implements OnInit , ControlValueAccessor {
  FinDetails = [];
  DocDate: string;
  private elRef:any;

  @Output() ngModelChange = new EventEmitter();
  constructor(private elem: ElementRef,
    private _renderer: Renderer2,
    private renderer: Renderer,
    private model:NgModel,
    private $http: HttpClient,
    private commonApi: CompacctCommonApi) {
      console.log(this.DocDate)
      this.elRef = this.elem.nativeElement;
     }
    ngOnInit() {
      this.GetFinDetails();
    }
    registerOnChange(fn: (_: any) => void): void { }
    registerOnTouched(fn: () => void): void {  }
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
          this.renderer.setElementProperty(this.elRef, 'valueAsDate', endDate);
          this.model['valueAsDate'] = endDate;
          this.renderer['valueAsDate'] = endDate;
          this.ngModelChange.emit(this.elRef.value);
          this.model.valueAccessor.writeValue(endDate);
          this.model.viewToModelUpdate(endDate);
          this.model.model = endDate;
          console.log(this.model)
        }

    }
  }

}
