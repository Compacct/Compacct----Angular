import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import {TreeNode} from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';


@Component({
  selector: 'app-service-support-ticket',
  templateUrl: './service-support-ticket.component.html',
  styleUrls: ['./service-support-ticket.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ServiceSupportTicketComponent implements OnInit {
  items :any =[];
  tabIndexToView = 0;
  Spinner = false; 
  buttonname = "Create";
  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private GlobalAPI : CompacctGlobalApiService,
    private Header : CompacctHeader,
    private DateService : DateTimeConvertService,
    private compacctToast : MessageService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Support Ticket",
      Link: "Support Ticket"
    });
    this.items = ["BROWSE", "CREATE"];
  }
  onReject() {
    this.compacctToast.clear('c');
  }
  onConfirm(){}
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.clearData(); 
      
  }
  clearData(){

  }
}
