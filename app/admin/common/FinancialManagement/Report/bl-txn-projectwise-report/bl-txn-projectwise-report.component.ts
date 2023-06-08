import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-bl-txn-projectwise-report',
  templateUrl: './bl-txn-projectwise-report.component.html',
  styleUrls: ['./bl-txn-projectwise-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BlTxnProjectwiseReportComponent implements OnInit {

  constructor(
    public Header: CompacctHeader,
    public DateService: DateTimeConvertService,
    public $http: HttpClient,
    public compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Project Wise Report",
      Link: " Financial Management -> Report-> Project Wise Report"
       });
  }

}
