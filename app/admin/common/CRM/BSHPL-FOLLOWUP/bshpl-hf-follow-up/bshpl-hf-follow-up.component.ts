import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-bshpl-hf-follow-up',
  templateUrl: './bshpl-hf-follow-up.component.html',
  styleUrls: ['./bshpl-hf-follow-up.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BSHPLHfFollowUpComponent implements OnInit {
  seachSpinner = false;
  getAllFollowUpdata:any = [];
  items: any = [];
  tabIndexToView: number = 0;
  FollowupDate = new Date();
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
     this.items = ["REGULAR","WEBSITE","DOCTOR MKT","AFTER SALE"];
    this.Header.pushHeader({
      Header: "FOLLOW UP",
      Link: "CRM -> BSHPL-follow Up -> BSHPL HA Follow Up"
    })
  }
  onReject(){}
  GetSearchedList(valid?){}
  Appointment(){}
   TabClick(e) {
    this.tabIndexToView = e.index;
     this.items = ["REGULAR","WEBSITE","DOCTOR MKT","AFTER SALE"];
  }

}
