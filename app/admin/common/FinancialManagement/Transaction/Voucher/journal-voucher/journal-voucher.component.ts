import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MessageService } from "primeng/api";
import { Console } from 'console';
import { CompacctGlobalUrlService } from '../../../../../shared/compacct.global/global.service.service';
import { CompacctHeader } from '../../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../../shared/compacct.services/common.api.service';
import { DateTimeConvertService } from '../../../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class JournalVoucherComponent implements OnInit {
  items = [];
  menuList = [];
  tabIndexToView = 0;
  buttonname = "Create";
  objjournal:journal = new journal();
  journalFormSubmitted = false;
  voucherdata = new Date();
  costCentList = [];
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Journal Voucher",
      Link: "Financial Management --> Transaction -> Journal"
    });
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){

  }
}
class journal{
  Voucher_No:number;
  Cost_Cen_ID_Trn:number;
}