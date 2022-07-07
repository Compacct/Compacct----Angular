import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import * as moment from "moment";
declare var $:any;

@Component({
  selector: 'app-rep-stock-report',
  templateUrl: './rep-stock-report.component.html',
  styleUrls: ['./rep-stock-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class REPStockReportComponent implements OnInit {

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Stock Report",
      Link: " Material Management -> Report ->  Stock Report"
    });
  }

}
