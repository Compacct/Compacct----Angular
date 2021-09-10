import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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


  @Output() DaterangeObj = new EventEmitter();
  @ViewChild('compactDaterange',{static:false}) compactDaterange:ElementRef;


  FinDetails = [];
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi) { }

  ngOnInit() {
  }

  rangeSelected ( events) {
    if (events.length === 2) {
      this.DaterangeObj.emit(events);
    } else {
      this.DaterangeObj.emit(null);
    }
  }

}
