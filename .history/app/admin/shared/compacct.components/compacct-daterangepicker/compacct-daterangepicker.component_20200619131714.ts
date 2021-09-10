import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

    public max = "2099-11-31";
    public min = "1900-01-01";
  @Output() DaterangeObj = new EventEmitter();

  FinDetails = [];
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi) { }

  ngOnInit() {
  }
  GetFinDetails() {
    const fin = JSON.parse(localStorage.getItem('Fin'));
    console.log(fin);

    if(fin.Fin_Year_ID || this.commonApi.CompacctCookies.Fin_Year_ID) {
      const id = fin.Fin_Year_ID ? fin.Fin_Year_ID : this.commonApi.CompacctCookies.Fin_Year_ID;
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
        const StartDate = moment(new Date(this.FinDetails['Fin_Year_Start'])).format("YYYY-MM-DD");
        const EndDate = moment(new Date(this.FinDetails['Fin_Year_End'])).format("YYYY-MM-DD");
        this.max = EndDate;
        this.min = StartDate;

        });

    }
  }
  rangeSelected ( events) {
    if (events.length === 2) {
      this.DaterangeObj.emit(events);
    } else {
      this.DaterangeObj.emit(null);
    }
  }

}
