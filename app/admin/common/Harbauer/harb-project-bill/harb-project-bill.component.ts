import { filter } from 'rxjs/operators';
import { DateTimeConvertService } from './../../../shared/compacct.global/dateTime.service';
import { CompacctHeader } from './../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from './../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from './../../../shared/compacct.services/common.api.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-harb-project-bill',
  templateUrl: './harb-project-bill.component.html',
  styleUrls: ['./harb-project-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HarbProjectBillComponent implements OnInit {
  items:any = []
  tabIndexToView:any = 0
  buttonname = "Create";
  constructor(
    public $http: HttpClient,
    public commonApi: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService,
    public Header: CompacctHeader,
    public DateService: DateTimeConvertService,
    public compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Project Bill",
      Link: "Project Management -> Project Bill"
    })
  }
  clearData(){
    
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  onConfirm(){}
 
}
