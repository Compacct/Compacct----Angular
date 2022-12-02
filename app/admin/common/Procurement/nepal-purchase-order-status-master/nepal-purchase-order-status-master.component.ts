import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
@Component({
  selector: 'app-nepal-purchase-order-status-master',
  templateUrl: './nepal-purchase-order-status-master.component.html',
  styleUrls: ['./nepal-purchase-order-status-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalPurchaseOrderStatusMasterComponent implements OnInit {
  items: any = [];
  buttonname: string = "Save"
  datalist=["Test"]
  constructor(
     private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["Status Master"];
    this.Header.pushHeader({
      Header: "PO Status Master",
      Link: " Procurement ->  Nepal BL Txn Purchase Order status Master"
    });
  }

}
