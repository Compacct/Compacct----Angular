import { Directive, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../compacct.services/common.api.service';
import * as moment from "moment";

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[CompacctFinyearonly]'
})
export class CompacctFinyearwisedateDirective implements OnInit {
  FinDetails = [];
  DocDate: string;
  private elRef:any;
  constructor(private elem: ElementRef,
    private _renderer: Renderer2,
    private $http: HttpClient,
    private commonApi: CompacctCommonApi) {
      console.log(this.DocDate)
      this.elRef = this.elem.nativeElement;
     }
    ngOnInit() {
      this.GetFinDetails();
      console.log('work')
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
          const endDate = moment(EndDate, "DD-MMM-YYYY");
          this.elRef.value = endDate;
        }

    }
  }

}
