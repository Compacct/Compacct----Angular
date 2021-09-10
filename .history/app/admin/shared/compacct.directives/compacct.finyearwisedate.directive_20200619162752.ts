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
  constructor(private elRef: ElementRef,
    private _renderer: Renderer2,
    private $http: HttpClient,
    private commonApi: CompacctCommonApi) {
      console.log(this.DocDate)
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
        console.log(this.elRef.nativeElement);
        console.log(this.elRef);
        this._renderer.setAttribute(this.elRef.nativeElement, "min",moment(new Date(this.FinDetails['Fin_Year_Start'])).format("YYYY-MM-DD"));
        this._renderer.setAttribute(this.elRef.nativeElement, "max",moment(new Date(this.FinDetails['Fin_Year_End'])).format("YYYY-MM-DD"));
        //this.max = EndDate;
       // this.min = StartDate;
        if ((today > StartDate) && (today < EndDate)) {

        } else{
          this.elRef.nativeElement.value = moment(EndDate, "YYYY-MM-DD");;
        }

    }
  }

}
