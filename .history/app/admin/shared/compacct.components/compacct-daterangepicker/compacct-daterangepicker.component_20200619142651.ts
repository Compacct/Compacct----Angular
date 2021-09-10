import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
declare var $: any;
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../compacct.services/common.api.service';

@Component({
  selector: 'app-compacct-daterangepicker',
  templateUrl: './compacct-daterangepicker.component.html',
  styleUrls: ['./compacct-daterangepicker.component.css', '../../../../../assets/custom/daterange.css']
})
export class CompacctDaterangepickerComponent implements OnInit {
  daterangepickerOptions = {};
    public today: Date = new Date(new Date().toDateString());
    public today2:Date = new Date(new Date().toDateString());
    public weekStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 7) % 7)).toDateString());
    public weekEnd: Date = new Date(new Date(new Date().setDate(new Date(new Date().setDate((new Date().getDate()
        - (new Date().getDay() + 7) % 7))).getDate() + 6)).toDateString())
        ;
    public monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
    public monthEnd: Date = this.today;
    public lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
    public lastEnd: Date = this.today;
    public yearStart: Date = new Date(new Date(new Date().setDate(new Date().getDate() - 365)).toDateString());
    public yearEnd: Date = this.today;

    public max: Date =  new Date(2099,11,31);
    public min: Date =  new Date(1900,2,1);
  @Output() DaterangeObj = new EventEmitter();
  @ViewChild('compactDaterange',{static:false}) compactDaterange:ElementRef;


  FinDetails = [];
  constructor(
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
        this.max = EndDate;
        this.min = StartDate;
        if ((today > StartDate) && (today < EndDate)) {

        } else{
          const obj = [StartDate,EndDate];
          this.compactDaterange['value'] = obj;
          this.rangeSelected(obj);
        }

        });

    }
  }
  rangeSelected ( events) {
    console.log(events)
    if (events.length === 2) {
      this.DaterangeObj.emit(events);
    } else {
      this.DaterangeObj.emit(null);
    }
  }

}
