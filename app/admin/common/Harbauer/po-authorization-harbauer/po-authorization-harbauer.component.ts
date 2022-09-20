import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-po-authorization-harbauer',
  templateUrl: './po-authorization-harbauer.component.html',
  styleUrls: ['./po-authorization-harbauer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class POAuthorizationHarbauerComponent implements OnInit {
  items :any =[];
  tabIndexToView = 0;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {}

ngOnInit() {
    this.items = ["Pending Authorization", "Authorized PO","Not Authorized PO"];
    this.Header.pushHeader({
      Header: "PO Authorization",
      Link: "Harbauer -> PO Authorization-harbauer"
    });
}
TabClick(e){
  this.tabIndexToView = e.index;
  this.items = ["Pending Authorization", "Authorized PO","Not Authorized PO"];
  //this.clearData();   
}

}
