import { Directive, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../compacct.services/common.api.service';

@Directive({
  selector: '[compacctFinyearwisedate]'
})
export class CompacctFinyearwisedateDirective implements OnInit {
  FinDetails = [];
  constructor(private elRef: ElementRef,
    private $http: HttpClient,
    private commonApi: CompacctCommonApi) { }
    ngOnInit() {
      this.GetFinDetails();
    }
  GetFinDetails() {
    const fin = JSON.parse(localStorage.getItem('Fin'));
    if(fin[0].Fin_Year_ID || this.commonApi.CompacctCookies.Fin_Year_ID) {
      const id = fin[0].Fin_Year_ID ? fin[0].Fin_Year_ID : this.commonApi.CompacctCookies.Fin_Year_ID;
      this.$http
        .get('/Common/Get_Fin_Year_Date?Fin_Year_ID=' + id, {})
        .subscribe((data: any) => {
          this.FinDetails = data ? JSON.parse(data)[0] : [];
          if (fin) {
            localStorage.setItem('Fin', '');
            localStorage.setItem('Fin', JSON.stringify([JSON.parse(data)[0]]));
        } else {
            localStorage.setItem('Fin', JSON.stringify([JSON.parse(data)[0]]));
        }
        const StartDate = new Date(this.FinDetails['Fin_Year_Start']);
        const EndDate =new Date(this.FinDetails['Fin_Year_End']);
        const today = new Date();
        console.log(this.elRef.nativeElement);
        console.log(this.elRef)
        //this.max = EndDate;
       // this.min = StartDate;
        if ((today > StartDate) && (today < EndDate)) {

        } else{
        }

        });

    }
  }

}
