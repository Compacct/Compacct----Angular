import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import * as moment from "moment";

@Component({
  selector: 'app-compacct-stock-report',
  templateUrl: './compacct-stock-report.component.html',
  styleUrls: ['./compacct-stock-report.component.css'],
  providers: [MessageService]
})
export class CompacctStockReportComponent implements OnInit {
  url = window["config"];
  buttonname = "Create";
  Spinner = false;
  seachSpinner = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {this.Header.pushHeader({
    Header: "Stock Report",
    Link: " Material Management -> Report ->  Stock Report"
  });
  }

}
