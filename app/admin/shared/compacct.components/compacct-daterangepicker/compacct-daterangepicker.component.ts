import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
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
    public today2: Date = new Date(new Date().toDateString());
    public StartDate = this.today;
    public EndDate = this.today2;
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
    public TutopiaPendigTickStart = new Date(new Date(2021,3, 1).toDateString());
    public TutopiaPendigTickEnd = this.today;
    public CurrentMonthStart = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    public CurrentMonthEnd = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
    EnabledFlag = true;
    mindatevalue = new Date("01-01-1990");
    maxdatevalue = new Date(this.today.getFullYear() + 5, this.today.getMonth() + 1, 0);
    public minDate = this.mindatevalue;
    public maxDate = this.maxdatevalue;
  @Output() DaterangeObj = new EventEmitter();
  @Input() set DefaultDateOpt(value:any) {
     if (value === 'weekwise') {
      this.StartDate = this.weekStart;
       this.EndDate = this.weekEnd;
      this.DaterangeObj.emit([this.StartDate,this.EndDate]);
    }else if (value === 'TutopiaPendigTick') {
      this.StartDate = this.TutopiaPendigTickStart;
       this.EndDate = this.TutopiaPendigTickEnd;
      this.DaterangeObj.emit([this.StartDate,this.EndDate]);
    }else if (value === 'MonthStarttoEnd') {
      this.StartDate = this.CurrentMonthStart;
       this.EndDate = this.CurrentMonthEnd;
      this.DaterangeObj.emit([this.StartDate,this.EndDate]);
    } else {
      this.StartDate = this.today;
      this.EndDate = this.today2;
    }

  }
  @Input() set HardCodeDateOpt(value:any) {
    if (value.length) {
      this.StartDate = value[0];
      this.EndDate = value[1];
      this.DaterangeObj.emit([this.StartDate,this.EndDate]);
   }

 }
  @Input() set DefaultEnable(value:any) {
  this.EnabledFlag = value ? false :  true;
  }
  @Input() set minmaxValid(value:any) {
    if (value.length) {
     if(this.dateCheck(value[0],value[1],new Date()) ) {
      this.minDate = value[0];
       this.maxDate = value[1];
       this.StartDate = this.minDate;
        this.EndDate = this.today;

     } else {
      this.minDate = value[0];
       this.maxDate = value[1];
       this.StartDate = this.minDate;
        this.EndDate = this.maxDate;

     }
      this.DaterangeObj.emit([this.StartDate,this.EndDate]);
   } else {
     this.minDate = this.mindatevalue;
     this.maxDate = this.maxdatevalue;
     this.StartDate = this.today;
     this.EndDate = this.today2;
   }

 }
  @ViewChild('compactDaterange',{static:false}) compactDaterange:ElementRef;


  FinDetails = [];
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi) { }

  ngOnInit() {
  }
  dateCheck(from,to,check) {

    var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
}
  rangeSelected(events) {
    if (events.length === 2) {
      this.DaterangeObj.emit(events);
    } else {
      this.DaterangeObj.emit(null);
    }
  }

}
